export default {
  sendCommentText: (message, page, conversation_select) => {
    window.FB.api(
      `/${conversation_select.id}/comments`,
      'POST',
      {
        access_token: page.access_token,
        message
      },
      response => {
        if (response && !response.error) {
          /* handle the result */
          // setLoading(false);
          console.log(response);
        }
      }
    );
  },
  sendCommentImage: (image, page, conversation_select) =>
    window.FB.api(
      `/${conversation_select.id}/comments`,
      'POST',
      {
        access_token: page.access_token,
        attachment_url: image.src
      },
      response => {
        if (response && !response.error) {
          /* handle the result */
          // setLoading(false);
          console.log(response);
        }
      }
    ),

  compare: (a, b) => {
    // Use toUpperCase() to ignore character casing
    const bandA = a.updatedTime;
    const bandB = b.updatedTime;

    let comparison = 0;
    if (bandA > bandB) {
      comparison = -1;
    } else if (bandA < bandB) {
      comparison = 1;
    }
    return comparison;
  }
};
