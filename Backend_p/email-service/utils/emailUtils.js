const trackLinkClick = async (email, linkId) => {
    const { error } = await supabase
      .from('email_logs')
      .update({ link_clicked: true, link_id: linkId })
      .eq('email', email);
  
    if (error) {
      console.error('Error tracking link click:', error);
    }
  };
  
  module.exports = { trackLinkClick };
  