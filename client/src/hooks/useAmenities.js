import { useState, useEffect } from 'react';
const useAmenities = (lat, lng, id) => {
    const [amenities, setAmenities] = useState({});
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      if (!id) return;
  
      const fetchAmenities = async () => {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:8080/api/housing/amenities/${id}`);
          const data = await response.json();
          
          const transformed = {
            cafe: data.amenities?.cafe || [],
            gym: data.amenities?.gym || [],
            restaurant: data.amenities?.restaurant || [],
            supermarket: data.amenities?.supermarket || []
          };
          
          setAmenities(transformed);
        } catch (error) {
          console.error("Error fetching amenities:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAmenities();
    }, [id]);
  
    return { amenities, loading };
  };
  

  export default useAmenities;
