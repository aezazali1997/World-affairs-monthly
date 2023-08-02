import { config } from 'dotenv'
import { createConnection } from 'mysql2';
import dns from 'dns';
// @ts-ignore
import { subdivision } from 'iso-3166-2';
// @ts-ignore
import geoip from 'geoip-lite';
import { countries } from 'countries-list';
import countriesData from '../utils/countries-data.json'
config();

export class SQLService {
    private static instance: SQLService
    connection: any;
    constructor() {
        this.connection = createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME

        })

    }
    static init() {
        if (!SQLService.instance) {
            SQLService.instance = new SQLService();
        }

        return SQLService.instance;
    }
    public async getAllIP(pageNumber: number = 1, pageSize: number = 10) {
        try {
            const client = this.connection;
            const offset = (pageNumber - 1) * pageSize;
            const query = `SELECT * FROM ip_address LIMIT ? OFFSET ?`;

            const results: any[] = await new Promise((resolve, reject) => {
                client.query(query, [pageSize, offset], (err: any, results: any) => {
                    if (err) {
                        console.error('Error executing query:', err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });

            const data = await Promise.all(results.map(async (item: any) => {
                const serviceProvider = await this.getDNS(item.ip_addres);
                let country;
                let region;
                let city;
                let ll;
                let timezone;
                let range;
                let proxy;
                let mobile;
                let isp;
                let organization;
                const geo = geoip.lookup(item.ip_addres)
                if (geo) {
                    country = geo.country,
                        region = geo.region
                    city = geo.city
                    ll = geo.ll
                    timezone = geo.timezone
                    range = geo.range
                    proxy = geo.proxy
                    mobile = geo.mobile
                    isp = geo.isp
                    organization = geo.organization

                }
                return {
                    IpAddress: item.ip_addres,
                    ServiceProvider: serviceProvider,
                    country: this.getCountryName(country),
                    flag: countriesData[`${geo.country as keyof typeof countriesData}`].image,
                    countryCode: country,
                    region: this.getRegionName(country, region),
                    city,
                    ll,
                    timezone,
                    range,
                    proxy,
                    mobile,
                    isp,
                    organization
                };
            }));

            return data
        } catch (error) {
            console.error('Error retrieving IP data:', error);
            return [];
        }
    }

    public async getServiceProviderForIP(ipAddress: string): Promise<string> {
        try {
            const hostnames = await dns.promises.reverse(ipAddress);
            const serviceProvider = hostnames[0] || 'Unknown';
            return serviceProvider;
        } catch (error) {
            return 'Unknown';
        }
    }
    public async getDNS(ipAddress: string) {
        try {
            const response = await this.getServiceProviderForIP(ipAddress);
            return response;
        } catch (error) {
            return error;
        }
    }
    getCountryName(countryCode: string) {
        // @ts-ignore
        return countries[countryCode] || 'Unknown';
    }
    // Function to get the full region name from the region code
    getRegionName(countryCode: string, regionCode: string) {
        const key = `${countryCode}-${regionCode}`;
        return subdivision(key) || regionCode;
    }



}