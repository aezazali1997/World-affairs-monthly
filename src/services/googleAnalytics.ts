import { google } from "googleapis";
export async function getCountriesReport(startDate: string, endDate: string) {

  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_PRIVATE_KEY,
    ['https://www.googleapis.com/auth/analytics.readonly'],
    undefined
  )
  const propertyId = process.env.GOOGLE_GA4_PROPERTY_ID

  try {
    const analyticsData = google.analyticsdata({ version: 'v1beta', auth });



    const response = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'eventCount' }],
      },
    });
    const countryData = response.data.rows!.map((row) => {
      return { country: row.dimensionValues![0].value, users: row.metricValues![0].value };
    });

    return countryData
  } catch (err) {
    console.error('Error retrieving analytics data:', err);
  }
}

export async function getCitiesReport(startDate: string, endDate: string) {

  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_PRIVATE_KEY,
    ['https://www.googleapis.com/auth/analytics.readonly'],
    undefined
  )

  const propertyId = process.env.GOOGLE_GA4_PROPERTY_ID
  const analyticsData = google.analyticsdata({ version: 'v1beta', auth });

  const request = {
    reportRequests: [

    ],
  };

  try {
    const response = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody:
      {
        dateRanges: [{ startDate, endDate }],
        metrics: [{ name: 'eventCount' }],
        dimensions: [{ name: 'city' }]

      },



    });
    const cityUserData = response.data.rows!.map((row) => {
      return { city: row.dimensionValues![0].value, users: row.metricValues![0].value };
    });
    return cityUserData;
  } catch (err) {
    console.error('Error retrieving analytics data:', err);
  }
}

export async function getMobileDesktopPercentage(startDate: string, endDate: string) {


  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_PRIVATE_KEY,
    ['https://www.googleapis.com/auth/analytics.readonly'],
    undefined
  )

  const analyticsData = google.analyticsdata({ version: 'v1beta', auth });

  const propertyId = process.env.GOOGLE_GA4_PROPERTY_ID;


  try {
    const response = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate, endDate }],
        metrics: [{ name: 'activeUsers' }],
        dimensions: [{ name: 'deviceCategory' }],
      }
    });
    const rows = response.data.rows;

    let desktopUsers = 0;
    let mobileUsers = 0;

    rows!.forEach((row) => {
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

export async function getWebsiteViews(startDate: string, endDate: string) {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_PRIVATE_KEY,
    ['https://www.googleapis.com/auth/analytics.readonly'],
    undefined
  );

  const analyticsData = google.analyticsdata({ version: 'v1beta', auth });
  const propertyId = process.env.GOOGLE_GA4_PROPERTY_ID;

  try {
    const response = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {

        dateRanges: [{ startDate, endDate }],
        metrics: [{ name: 'eventCount' }],


      }
    });
    // The response will contain the total number of views for the specified date range.
    const rows = response.data.rows;
    const totalViews = rows!.reduce(
      (totalViews, row) => totalViews + parseInt(row.metricValues![0].value!),
      0
    );

    // `totalViews` will now contain the total number of views for the specified date range.
    return totalViews;
  } catch (err) {
    console.error('Error retrieving analytics data:', err);
  }
}
export async function getList(startDate: string, endDate: string) {

  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_PRIVATE_KEY,
    ['https://www.googleapis.com/auth/analytics.readonly'],
    undefined
  );

  const analyticsData = google.analyticsdata({ version: 'v1beta', auth });
  const propertyId = process.env.GOOGLE_GA4_PROPERTY_ID;
  const propertyConfigurations = [
    {
      propertyId: 'YOUR_GA4_PROPERTY_ID_1',
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
        const { data } = await analyticsData.properties.runReport({
          property: `properties/${propertyId}`,
          requestBody: {
            dateRanges: config.dateRanges,
            metrics: config.metrics,
            dimensions: config.dimensions,
          },
        });

        // Parse the response data and convert it to the desired format.
        const formattedData = data.rows!.map((row) => {
          const [country, city, deviceCategory, operatingSystem,] = row.dimensionValues!.map(
            (value) => value.value
          );
          const [averageSessionDuration, newUsers] = row!.metricValues!.map((value) => value.value)

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

export const getTotalUsers = async (startDate: string, endDate: string) => {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_PRIVATE_KEY,
    ['https://www.googleapis.com/auth/analytics.readonly'],
    undefined
  );

  const analyticsdata = google.analyticsdata({ version: 'v1beta', auth });

  const propertyId = process.env.GOOGLE_GA4_PROPERTY_ID

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
    const { data } = await analyticsdata.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: request,

    });
    const totalUsers = data.rows![0].metricValues![0].value

    return totalUsers;
  } catch (error) {
    console.error('An error occurred:', error);
    return null;
  }

}

export const usersVSMonth = async (startDate: string, endDate: string) => {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_PRIVATE_KEY,
    ['https://www.googleapis.com/auth/analytics.readonly'],
    undefined
  );


  const analyticsData = google.analyticsdata({ version: 'v1beta', auth });

  const propertyId = process.env.GOOGLE_GA4_PROPERTY_ID;

  try {
    const { data } = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
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




    const return_data = data.rows!.map((row) => {
      const dimensions = row.dimensionValues;
      const metrics = row.metricValues![0].value;
      const yearMonth = dimensions![0].value!.replace(/(\d{4})(\d{2})/, '$1-$2');
      return {
        yearMonth,
        users: parseInt(metrics!, 10),
      };
    });
    return_data.sort((a, b) => (a.yearMonth > b.yearMonth ? 1 : -1));

    return return_data;
  } catch (error) {
    console.error('An error occurred:', error);
    return null;
  }
}
export const uniqueVisitors = async (startDate: string, endDate: string) => {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_PRIVATE_KEY,
    ['https://www.googleapis.com/auth/analytics.readonly'],
    undefined
  );

  const analyticsData = google.analyticsdata({ version: 'v1beta', auth });
  const propertyId = process.env.GOOGLE_GA4_PROPERTY_ID;

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
    const { data } = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: request,
    });
    data.rows?.map((row) => {
      if (row.dimensionValues![0].value === 'new') {
        unique = row.metricValues![0].value
      }
    })
    return unique;
  }
  catch (error) {
    console.error('An error occurred:', error);

  }
}
export const uniqueVsReturningVisitors = async (startDate: string, endDate: string) => {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_PRIVATE_KEY,
    ['https://www.googleapis.com/auth/analytics.readonly'],
    undefined
  );


  const analyticsData = google.analyticsdata({ version: 'v1beta', auth });
  const propertyId = process.env.GOOGLE_GA4_PROPERTY_ID;

  try {
    let unique = 0;
    let returning = 0
    const { data } = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
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
      data.rows.map((row) => {
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
export const maleVsFemale = async (startDate: string, endDate: string) => {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_PRIVATE_KEY,
    ['https://www.googleapis.com/auth/analytics.readonly'],
    undefined
  );

  const analyticsData = google.analyticsdata({ version: 'v1beta', auth });
  const propertyId = process.env.GOOGLE_GA4_PROPERTY_ID;

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

    const maleResponse = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: maleRequest,
    });
    const femaleResponse = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
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
export const AgeStats = async (startDate: string, endDate: string) => {

  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_PRIVATE_KEY,
    ['https://www.googleapis.com/auth/analytics.readonly'],
    undefined
  );

  const analyticsData = google.analyticsdata({ version: 'v1beta', auth });
  const propertyId = process.env.GOOGLE_GA4_PROPERTY_ID;


  try {
    const { data } = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate, endDate }],
        metrics: [{ name: 'newUsers' }],
        dimensions: [{ name: 'userAgeBracket' }],
      },
    });
    console.log('data', data)
    let ageBracket = 0;
    let usersCount = 0;
    let ageData = { ageBracket, usersCount }
    if (data.rows) {

      const ageData = data.rows!.map((row: any) => {

        ageBracket = row.dimensions![0];

        usersCount = parseInt(row.metrics![0].values![0], 10);

        return { ageBracket, usersCount };
      });
    }
    return ageData;
  } catch (error) {
    console.error('Error retrieving analytics data:', error);
  }
}