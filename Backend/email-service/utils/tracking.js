/**
 * Wraps the links with tracking parameters
 * @param {string} htmlContent - The HTML content to wrap links in.
 * @param {string} recipient - The email recipient to track.
 * @returns {string} - The HTML content with wrapped links.
 */
function wrapLinksWithTracking(htmlContent, recipient) {
  // Define the tracking base URL
  const trackingBaseUrl = 'https://your-tracking-url.com/track';

  // Create a tracking parameter based on recipient (e.g., email or user ID)
  const trackingParam = `?email=${encodeURIComponent(recipient)}&source=email_campaign`;

  // Use a regular expression to find all <a> tags and modify their href
  return htmlContent.replace(/<a href="([^"]+)"/g, (match, link) => {
    // Append tracking parameters to the link
    const trackedLink = `${trackingBaseUrl}?originalUrl=${encodeURIComponent(link)}${trackingParam}`;

    return `<a href="${trackedLink}"`; // Return the updated <a> tag with the tracking URL
  });
}

/**
 * Generates a tracking pixel (1x1 image) to track email opens
 * @param {string} recipient - The email recipient to track.
 * @returns {string} - The HTML string for the tracking pixel.
 */
function getTrackingPixel(recipient) {
  // Define the tracking URL (this would be a server endpoint you control)
  const trackingUrl = `https://your-tracking-server.com/pixel`;

  // Add recipient-specific tracking parameters to the pixel URL
  const pixelUrl = `${trackingUrl}?email=${encodeURIComponent(recipient)}&campaign=email_campaign`;

  // Return the HTML for a 1x1 transparent image (tracking pixel)
  return `<img src="${pixelUrl}" width="1" height="1" style="display:none;" />`;
}

// Export the functions for use in other parts of the application
module.exports = {
  wrapLinksWithTracking,
  getTrackingPixel,
};
