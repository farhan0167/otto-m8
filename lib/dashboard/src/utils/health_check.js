import { health_check } from "../api/health_check";

export const checkHealth = async (deployment_url, setLoading, num_retries = 50) => {
    setLoading({loading: true, message: 'Loading Resources...'});
    let retries = 0
    while(true){
      const health = await health_check(deployment_url);
      if (health) {
        setLoading({loading: false, message: ''});
        return 1
      }
      else {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
        if (retries < num_retries) {
          retries += 1
          console.log(`Retrying health check... (${retries}/${num_retries})`);
        }
        else {
          console.log('Health check failed');
          setLoading({loading: false, message: ''});
          return 0
        }
      }
    }
  };