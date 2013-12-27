module.exports = {
  success: function(data){
    return {
      status: 'success',
      data: data,
      message: null 
    };
  },
  error: function(err){
    return {
      status: 'error',
      data: null,
      message: err.message
    }
  }
};