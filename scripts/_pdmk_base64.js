(function(_){
  var InvalidCharacterError = function(msg) {
    this.message = msg;
  };
  InvalidCharacterError.prototype = new Error;
  InvalidCharacterError.prototype.name = 'InvalidCharacterError';
  _.btoa = _.btoa || function(inStr){
    var retVal = '', buf;
    if (/[^\x00-\xFF]/.test(inStr)) { // Test for valid input
      throw new InvalidCharacterError('String contains an invalid character');
    } else {
      for (var cntPos = 0; cntPos < inStr.length; cntPos += 3) {
        buf = [0];
        for (var cntChar = 0; cntChar < 3; cntChar ++) {
          var thisCode = ((cntPos+cntChar) < inStr.length) //->
              ? inStr.charCodeAt(cntPos+cntChar) : null;
          buf[cntChar]  |= thisCode >> ((cntChar)*2)
          buf[cntChar]   = buf[cntChar] >> 2
          if (thisCode !== null) {
            buf[cntChar+1] = (thisCode << (8-((cntChar+1)*2)) & 0xFF)
            if (cntChar === 2) { buf[cntChar+1] = buf[cntChar+1] >> 2; };
          } else {
            buf[2] = (inStr.length-cntPos === 1) ? null : buf[2];
            buf[3] = null;
            break;
          }
        }
        for (var cntBuf = 0; cntBuf < 4; cntBuf ++) {
          buf[cntBuf] = (buf[cntBuf] === null) //->
            ? 0x3D //->
            : (buf[cntBuf] < 26) //->
              ? buf[cntBuf] + 65 //->
              : (buf[cntBuf] < 52) //->
                ? buf[cntBuf] + 71 //->
                : (buf[cntBuf] < 62) //->
                  ? buf[cntBuf] - 4 //->
                  : (buf[cntBuf] === 62) ? 43 : 47;
          retVal += String.fromCharCode(buf[cntBuf]);
        }
      }
    }
    return retVal;
  };
  _.atob = _.atob || function(inStr){
    var retVal = '', buf;
    if (/[^A-Za-z0-9+\/=]/.test(inStr)) { // Test for valid input
      throw new InvalidCharacterError('String contains an invalid character');
    } else {
      while (inStr.length % 4) { inStr += '='; };
      for (var cntPos = 0; cntPos < inStr.length; cntPos += 4) {
        buf = [0];
        for (var cntChar = 0; cntChar < 4; cntChar ++) {
          var thisCode = inStr.charCodeAt(cntPos+cntChar);
          thisCode = ((thisCode & 0x5F) === thisCode) //->
            ? thisCode - 65 //->
            : (thisCode === 0x3D) //->
              ? null //->
              : (thisCode === 0x2B) //->
                ? 62 //->
                : (thisCode === 0x2F) //->
                  ? 63 //->
                  : ((thisCode & 0x3F) === thisCode) //->
                    ? thisCode + 4 //->
                    : ((thisCode & 0x7F) === thisCode) //->
                      ? thisCode - 71 : null;
          thisCode = (thisCode === null) ? null : thisCode << ((cntChar+1)*2);
          if ((cntChar) && (buf[cntChar-1] !== null)) { buf[cntChar-1] |= ((thisCode & 0xFF00) >> 8); };
          buf[cntChar] = (thisCode === null) ? null : (thisCode & 0xFF);
        }
        retVal += String.fromCharCode(buf[0]);
        retVal += (buf[2] === null) ? '' : String.fromCharCode(buf[1]);
        retVal += (buf[3] === null) ? '' : String.fromCharCode(buf[2]);
      }
    }
    return retVal;
  };
})(window);