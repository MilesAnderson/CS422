/*
Moo-Deng
Authors:
Andrew Chan

Date Created: Oct 8 2024

Description:
This file, `reportWebVitals.js`, measures and reports web performance metrics. It utilizes the `web-vitals` library to capture metrics such as Cumulative Layout Shift (CLS), First Input Delay (FID), First Contentful Paint (FCP), Largest Contentful Paint (LCP), and Time to First Byte (TTFB). These metrics can be used to monitor and improve user experience.
*/

/**
 * Function: reportWebVitals
 * This function initializes performance monitoring if a valid `onPerfEntry` callback is provided.
 * It dynamically imports the `web-vitals` library and captures various performance metrics.
 * 
 * Arguments:
 * - onPerfEntry: A callback function that receives the performance metrics.
 *   The function should handle the metrics, such as logging them or sending them to an analytics endpoint.
 */
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamically import the `web-vitals` library and retrieve its functions
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry); // Report Cumulative Layout Shift (CLS)
      getFID(onPerfEntry); // Report First Input Delay (FID)
      getFCP(onPerfEntry); // Report First Contentful Paint (FCP)
      getLCP(onPerfEntry); // Report Largest Contentful Paint (LCP)
      getTTFB(onPerfEntry); // Report Time to First Byte (TTFB)
    });
  }
};

export default reportWebVitals; // Export the function for use in the application

