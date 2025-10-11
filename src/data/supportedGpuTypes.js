// Price is in cents

// Also price amounts are completely divisible by 60, 30, 20, & 10
// We can deduct the amount every minute, every 2 minutes, every 3 minutes or every 6 minutes

//3090 is removed because price difference between 3090 and 4090 is very small

let supportedGpuTypes = {
  RTX_5090: {
    runpodId: "NVIDIA GeForce RTX 5090",
    price: 180,
    label: "Super Fast",
    secondaryLabel: "RTX 5090",
    features: ["32 GB VRAM", "35 GB RAM", "9vCPUs"],
    disabled: true,
  },
  RTX_4090: {
    runpodId: "NVIDIA GeForce RTX 4090",
    price: 120,
    label: "Fast",
    secondaryLabel: "RTX 4090",
    features: ["24 GB VRAM", "41 GB RAM", "6vCPUs"],
    disabled: true,
  },
  A40: {
    runpodId: "NVIDIA A40",
    price: 120,
    label: "Fast",
    secondaryLabel: "NVIDIA A40",
    features: ["48 GB VRAM", "94 GB RAM", "16vCPUs"],
  },
  L40S: {
    runpodId: "NVIDIA L40S",
    price: 180,
    label: "Super Fast",
    secondaryLabel: "NVIDIA L40S",
    features: ["48 GB VRAM", "50 GB RAM", "9vCPUs"],
  },

  A100_80GB_PCIE: {
    runpodId: "NVIDIA A100 80GB PCIe",
    price: 240,
    label: "Super Duper Fast",
    secondaryLabel: "NVIDIA H100 PCIe",
    features: ["80 GB VRAM", "117 GB RAM", "8vCPUs"],
  },

  // H100_PCIE: {
  //   runpodId: "NVIDIA H100 PCIe",
  //   price: 360,
  //   label: "Super Duper Fast",
  //   secondaryLabel: "NVIDIA H100 PCIe",
  //   features: ["80 GB VRAM", "188 GB RAM", "16vCPUs"],
  //   disabled: true,
  // },
  //   RTX_3090: { runpodId: "NVIDIA GeForce RTX 3090", pricing: 120 },
};

//Add per minute price
for (let itemId in supportedGpuTypes) {
  let item = supportedGpuTypes[itemId];
  item.perMinutePrice = item.price / 60;
}

console.log("Pricing", supportedGpuTypes);

export default supportedGpuTypes;
