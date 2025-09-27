// Price is in cents

// Also price amounts are completely divisible by 60, 30, 20, & 10
// We can deduct the amount every minute, every 2 minutes, every 3 minutes or every 6 minutes

//3090 is removed because price difference between 3090 and 4090 is very small

//per minute price can be calculated at run time but doing it here simplifies the code

let supportedGpuTypes = {
  RTX_5090: {
    runpodId: "NVIDIA GeForce RTX 5090",
    price: 180,
    label: "Super Fast",
  },
  RTX_4090: {
    runpodId: "NVIDIA GeForce RTX 4090",
    price: 120,
    label: "Fast",
  },
};

//Add per minute price
for (let itemId of supportedGpuTypes) {
  let item = supportedGpuTypes[itemId];
  item.perMinutePrice = item.price / 60;
}

console.log("Pricing", supportedGpuTypes);

export default supportedGpuTypes;
