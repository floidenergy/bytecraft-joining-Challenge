
class taskAppError extends Error{
  constructor(code, message){
    super(message);
    this.code = code;
  }
}

module.exports = taskAppError