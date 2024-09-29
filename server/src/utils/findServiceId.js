export const findServiceId = (category, specificService) => {
    const serviceData = [
      { category: "Gutters", serviceId: 100, description: "K-style > Install" },
    ];
  
    const foundService = serviceData.find(
      (service) =>
        service.category === category &&
        service.description.includes(specificService)
    );
    return foundService ? foundService.serviceId : null;
  };