export default class availabilityControl {
    static fetchCarparkData = async () => {
        const API_URL = "https://api.data.gov.sg/v1/transport/carpark-availability";
        try {
          const response = await fetch(API_URL);
          const data = await response.json();
          return data.items && data.items.length > 0 ? data.items[0].carpark_data : [];
        } catch (error) {
          console.error("Error fetching carpark data:", error);
          return [];
        }
      };
    
      static fetchCarparkRates = async (carparkNumber:string, selectedCarparkType:string) => {
        try {
          const response = await fetch(`http://localhost:3000/Rate?carparkID=${carparkNumber}&vehType=${selectedCarparkType}`, {
            method: "GET",
          });
          const data = await response.json();
          return data.rate;
        } catch (error) {
          console.error(`Error fetching rate for carpark ${carparkNumber}:`, error);
          return null;
        }
      };
}


// export const fetchCarparkData = async () => {
//     const API_URL = "https://api.data.gov.sg/v1/transport/carpark-availability";
//     try {
//       const response = await fetch(API_URL);
//       const data = await response.json();
//       return data.items && data.items.length > 0 ? data.items[0].carpark_data : [];
//     } catch (error) {
//       console.error("Error fetching carpark data:", error);
//       return [];
//     }
//   };

//   export const fetchCarparkRates = async (carparkNumber:string, selectedCarparkType:string) => {
//     try {
//       const response = await fetch(`http://localhost:3000/Rate?carparkID=${carparkNumber}&vehType=${selectedCarparkType}`, {
//         method: "GET",
//       });
//       const data = await response.json();
//       return data.rate;
//     } catch (error) {
//       console.error(`Error fetching rate for carpark ${carparkNumber}:`, error);
//       return null;
//     }
//   };