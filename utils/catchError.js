exports.verifyAddress = (address) => {
  let valid = true;
  const requiredFields = ["name", "city", "state", "area", "zipcode", "landmark", "flatnumber", "contact"];
  for(field of requiredFields) {
    if(!address[field]){
        valid = false;
        break;
    }
  }
  return valid;
}


