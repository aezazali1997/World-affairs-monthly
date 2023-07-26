import { google } from "googleapis";
export class GoogleAnalyticsDataApi {

  private auth: any
  private propertyId: string = '';
  private analyticsDataApi: any

  constructor() {
    this.auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      undefined,
      process.env.GOOGLE_PRIVATE_KEY,
      ['https://www.googleapis.com/auth/analytics.readonly'],
      undefined
    )
    this.setConfigs();
  }
  // only to be used when initializing class
  private setConfigs() {
    this.propertyId = process.env.GOOGLE_GA4_PROPERTY_ID || ''
    this.analyticsDataApi = google.analyticsdata({ version: 'v1beta', auth: this.auth });

  }
  public async getCountires(startDate: string, endDate: string) {
    try {
      const response = await this.analyticsDataApi.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'country' }],
          metrics: [{ name: 'eventCount' }],
        },
      });
      const countryData = response.data.rows!.map((row: any) => {
        return { country: row.dimensionValues![0].value, users: row.metricValues![0].value };
      });

      return countryData

    } catch (error) {
      console.error('Error retrieving analytics data:', error);

    }

  }



  public async getCitiesReport(startDate: string, endDate: string) {


    try {
      const response = await this.analyticsDataApi.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody:
        {
          dateRanges: [{ startDate, endDate }],
          metrics: [{ name: 'eventCount' }],
          dimensions: [{ name: 'city' }]

        },
      });
      const cityUserData = response.data.rows!.map((row: any) => {
        return { city: row.dimensionValues![0].value, users: row.metricValues![0].value };
      });
      return cityUserData;
    } catch (err) {
      console.error('Error retrieving analytics data:', err);
    }
  }

  public async getWebsiteViews(startDate: string, endDate: string) {
    try {
      const response = await this.analyticsDataApi.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: {

          dateRanges: [{ startDate, endDate }],
          metrics: [{ name: 'eventCount' }],
        }
      });
      // The response will contain the total number of views for the specified date range.
      const rows = response.data.rows;
      const totalViews = rows!.reduce(
        (totalViews: any, row: any) => totalViews + parseInt(row.metricValues![0].value!),
        0
      );

      // `totalViews` will now contain the total number of views for the specified date range.
      return { totalViews };
    } catch (err) {
      console.error('Error retrieving analytics data:', err);
    }
  }
  public async getMobileDesktopPercentage(startDate: string, endDate: string) {
    try {
      const response = await this.analyticsDataApi.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          metrics: [{ name: 'activeUsers' }],
          dimensions: [{ name: 'deviceCategory' }],
        }
      });
      const rows = response.data.rows;

      let desktopUsers = 0;
      let mobileUsers = 0;

      rows!.forEach((row: any) => {
        const dimensionValue = row.dimensionValues![0].value!.toLowerCase();
        const metricValue = parseInt(row.metricValues![0].value!);

        if (dimensionValue === 'desktop') {
          desktopUsers = metricValue;
        } else if (dimensionValue === 'mobile') {
          mobileUsers = metricValue;
        }
      });

      return { desktopUsers, mobileUsers };

    } catch (err) {
      console.error('Error retrieving analytics data:', err);
    }
  }
  public async getList(startDate: string, endDate: string) {

    const propertyConfigurations = [
      {
        dateRanges: [{ startDate, endDate }],
        metrics: [{ name: 'averageSessionDuration' }, { name: 'newUsers' }],
        dimensions: [
          { name: 'country' },
          { name: 'city' },
          { name: 'deviceCategory' },
          { name: 'operatingSystem' },
        ],
      }
    ]

    try {
      // Fetch data for each view configuration and store the results in an array.
      const results = await Promise.all(
        propertyConfigurations.map(async (config) => {
          const { data } = await this.analyticsDataApi.properties.runReport({
            property: `properties/${this.propertyId}`,
            requestBody: {
              dateRanges: config.dateRanges,
              metrics: config.metrics,
              dimensions: config.dimensions,
            },
          });

          // Parse the response data and convert it to the desired format.
          const formattedData = data.rows!.map((row: any) => {
            const [country, city, deviceCategory, operatingSystem,] = row.dimensionValues!.map(
              (value: any) => value.value
            );
            const [averageSessionDuration, newUsers] = row!.metricValues!.map((value: any) => value.value)

            return {
              country,
              city,
              deviceCategory,
              operatingSystem,
              averageSessionDuration,
              newUsers,
            };
          });

          return formattedData;
        })
      );
      return results;
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
  public maleVsFemale = async (startDate: string, endDate: string) => {


    const maleRequest = {
      dateRanges:
        [{ startDate, endDate }]
      ,
      dimensions: [
        {
          name: 'userGender',
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'userGender',
          stringFilter: {
            value: 'Male',
          },
        },
      },
    };

    const femaleRequest = {
      dateRanges:
        [{ startDate, endDate }]
      ,
      dimensions: [
        {
          name: 'userGender',
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'userGender',
          stringFilter: {
            value: 'Female',
          },
        },
      },
    };


    try {

      const maleResponse = await this.analyticsDataApi.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: maleRequest,
      });
      const femaleResponse = await this.analyticsDataApi.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: femaleRequest,
      });

      let maleUsersData = 0
      let maleUsersCount = 0
      let femaleUsersData = 0
      let femaleUsersCount = 0


      if (maleResponse.data.rows) {
        const maleUsersData = maleResponse.data.rows![0];
        const maleUsersCount = parseInt(maleUsersData.metricValues![0].value!);

      }
      if (femaleResponse.data.rows) {
        const femaleUsersData = femaleResponse.data.rows![0];
        const femaleUsersCount = parseInt(femaleUsersData.metricValues![0].value!);

      }

      return { maleUsersCount, femaleUsersCount };
    }
    catch (error) {
      console.error('An error occurred:', error);

    }

  }
  // const data = [
  //   { name: '18-24', value: 20 },
  //   { name: '25-34', value: 30 },
  //   { name: '35-44', value: 25 },
  //   { name: '45-54', value: 15 },
  //   { name: '55+', value: 10 },
  // ];
  public AgeStats = async (startDate: string, endDate: string) => {

    try {
      const { data } = await this.analyticsDataApi.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          metrics: [{ name: 'newUsers' }],
          dimensions: [{ name: 'userAgeBracket' }],
        },
      });
      // Create a mapping for age brackets returned by Google Analytics to the desired age brackets
      const ageBracketMap: { [key: string]: string } = {
        '18-24': '18-24',
        '25-34': '25-34',
        '35-44': '35-44',
        '45-54': '45-54',
        '55-64': '55+',
        '65+': '55+', // Combine 65+ with 55+ in the same category
      };

      // Provided age brackets
      const ageBrackets = ['18-24', '25-34', '35-44', '45-54', '55+'];

      // Initialize ageData object with all age brackets set to 0
      const ageData = ageBrackets.reduce((result: { [key: string]: number }, bracket) => {
        result[bracket] = 0;
        return result;
      }, {});

      if (data.rows) {
        // Update ageData with values from Google Analytics data
        data.rows.forEach((row: any) => {
          const ageBracket = row.dimensions![0];
          const usersCount = parseInt(row.metrics![0].values![0], 10);

          // Map the age bracket to the desired format using the ageBracketMap
          const name = ageBracketMap[ageBracket];

          // Add the usersCount to the corresponding age group
          if (name) {
            ageData[name] = usersCount;
          }
        });
      }

      // Convert the ageData object to the final array format
      const finalAgeData = Object.keys(ageData).map((name) => ({ name, value: ageData[name] }));

      return finalAgeData;
    } catch (error) {
      console.error('Error retrieving analytics data:', error);
      return [];
    }
  }
  public getTotalUsers = async (startDate: string, endDate: string) => {
    const request = {
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
      ],
    };

    try {
      const { data } = await this.analyticsDataApi.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: request,

      });
      const totalUsers = data.rows![0].metricValues![0].value
      return { totalUsers };
    } catch (error) {
      console.error('An error occurred:', error);
      return null;
    }
  }
  public usersVSMonth = async (startDate: string, endDate: string) => {

    try {
      const { data } = await this.analyticsDataApi.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: {
          dateRanges: [
            {
              startDate,
              endDate,
            },
          ],
          metrics: [
            {
              name: 'activeUsers',
            },
          ],
          dimensions: [
            {
              name: 'yearMonth'
            },
          ]
        }
      });
      const return_data = data.rows!.map((row: any) => {
        const dimensions = row.dimensionValues;
        const metrics = row.metricValues![0].value;
        const yearMonth = dimensions![0].value!.replace(/(\d{4})(\d{2})/, '$1-$2');
        return {
          yearMonth,
          users: parseInt(metrics!, 10),
        };
      });
      return_data.sort((a: any, b: any) => (a.yearMonth > b.yearMonth ? 1 : -1));

      return return_data;
    } catch (error) {
      console.error('An error occurred:', error);
      return null;
    }
  }
  public uniqueVisitors = async (startDate: string, endDate: string) => {

    const request = {
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
      ],
      dimensions: [
        {
          name: 'newVsReturning'
        }
      ]
    };
    try {
      let unique: any;
      const { data } = await this.analyticsDataApi.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: request,
      });
      data.rows?.map((row: any) => {
        if (row.dimensionValues![0].value === 'new') {
          unique = row.metricValues![0].value
        }
      })
      return {
        unique
      };
    }
    catch (error) {
      console.error('An error occurred:', error);

    }
  }

  public uniqueVsReturningVisitors = async (startDate: string, endDate: string) => {


    try {
      let unique = 0;
      let returning = 0
      const { data } = await this.analyticsDataApi.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: {
          dateRanges: [
            {
              startDate,
              endDate
            }
          ],
          metrics: [
            {
              name: 'activeUsers'
            }
          ],
          dimensions: [
            {
              name: 'newVsReturning'
            }
          ]
        }
      });
      if (data.rows) {
        data.rows.map((row: any) => {
          if (row!.dimensionValues![0].value === 'new') {
            unique = +(row!.metricValues![0].value!)
          }
          if (row!.dimensionValues![0].value === 'returning') {
            returning = +(row!.metricValues![0].value!)
          }
        })
      }
      return {
        unique,
        returning
      }
    }
    catch (error) {
      console.error('An error occurred:', error);
    }
  }
}