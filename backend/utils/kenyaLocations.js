// Representative sample - in production, fetch from MoE EMIS database
const kenyaLocations = {
  "Nairobi": {
    "Westlands": {
      "Kangemi": ["Kangemi Primary", "Kangemi JSS", "St. Anne's Kangemi"],
      "Kitisuru": ["Kitisuru Primary", "Peponi House Preparatory"]
    },
    "Nairobi Central": {
      "Nairobi Central": ["Nairobi Primary", "St. Mary's School", "Kenya High School"],
      "Pangani": ["Pangani Primary", "Pangani Girls' Secondary"]
    }
  },
  "Kiambu": {
    "Kiambu": {
      "Kiambu Ward": ["Kiambu Primary", "Kiambu High School", "Kiambu TVET"],
      "Ndenderu": ["Ndenderu Primary", "Ndenderu JSS"]
    },
    "Thika": {
      "Township": ["Thika Primary", "Thika High School", "Thika TTIs"]
    }
  },
  "Mombasa": {
    "Mombasa Island": {
      "Shimanzi": ["Shimanzi Primary", "Mombasa Technical University"]
    },
    "Nyali": {
      "Frere Town": ["Frere Town Primary", "Nyali Secondary"]
    }
  },
  "Kisumu": {
    "Kisumu Central": {
      "Kolwa East": ["Kolwa Primary", "Kolwa JSS"],
      "Railways": ["Railways Primary", "Kisumu Boys' High", "Kisumu Polytechnic"]
    }
  }
  // In production: all 47 counties, 290 sub-counties, 1,450 wards
};

module.exports = kenyaLocations;
