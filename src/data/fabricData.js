export const fabricData = {
  fardamento: {
    models: [
      { id: "fard1", name: "Fardamento Modelo 1", img: "/images/models/fardamento-1.png" },
      { id: "fard2", name: "Fardamento Modelo 2", img: "/images/models/fardamento-2.png" },
    ],
    arts: {
      fard1: Array.from({ length: 10 }, (_, i) => ({
        id: `fard1_art${i + 1}`,
        name: `Arte Fard1 #${i + 1}`,
      })),
      fard2: Array.from({ length: 10 }, (_, i) => ({
        id: `fard2_art${i + 1}`,
        name: `Arte Fard2 #${i + 1}`,
      })),
    },
  },

  camisa: {
     models: [
      { id: "cam1", name: "Camisa Modelo 1", img: "/images/models/camisa-1.png" },
      { id: "cam2", name: "Camisa Modelo 2", img: "/images/models/camisa-2.png" },
    ],
   
    arts: {
      cam1: Array.from({ length: 10 }, (_, i) => ({
        id: `cam1_art${i + 1}`,
        name: `Arte Cam1 #${i + 1}`,
      })),
      cam2: Array.from({ length: 10 }, (_, i) => ({
        id: `cam2_art${i + 1}`,
        name: `Arte Cam2 #${i + 1}`,
      })),
    },
  },

  agasalho: {
    models: [
      { id: "aga1", name: "Agasalho Modelo 1", img: "/images/models/agasalho-1.png" },
      { id: "aga2", name: "Agasalho Modelo 2", img: "/images/models/agasalho-2.png" },
    ],
    arts: {
      aga1: [
        {
          id: "aga1_art1",
          name: "Arte Aga1 #1",
          layers: [
            "/images/arts/agasalho/aga1/art1/layer1.png",
            "/images/arts/agasalho/aga1/art1/layer2.png",
          ],
        },
        {
          id: "aga1_art2",
          name: "Arte Aga1 #2",
          layers: [
            "/images/arts/agasalho/aga1/art2/layer1.png",
            "/images/arts/agasalho/aga1/art2/layer2.png",
          ],
        },
        {
          id: "aga1_art3",
          name: "Arte Aga1 #3",
          layers: [
            "/images/arts/agasalho/aga1/art3/layer1.png",
            "/images/arts/agasalho/aga1/art3/layer2.png",
          ],
        },
      ],
      aga2: [
        {
          id: "aga2_art1",
          name: "Arte Aga2 #1",
          layers: [
            "/images/arts/agasalho/aga2/art1/layer1.png",
            "/images/arts/agasalho/aga2/art1/layer2.png",
          ],
        },
        {
          id: "aga2_art2",
          name: "Arte Aga2 #2",
          layers: [
            "/images/arts/agasalho/aga2/art2/layer1.png",
            "/images/arts/agasalho/aga2/art2/layer2.png",
          ],
        },
        {
          id: "aga2_art3",
          name: "Arte Aga2 #3",
          layers: [
            "/images/arts/agasalho/aga2/art3/layer1.png",
            "/images/arts/agasalho/aga2/art3/layer2.png",
          ],
        },
      ],
    },
  },

  blusa: {

     models: [
      { id: "blu1", name: "Blusa Modelo 1", img: "/images/models/blusa-1.png" },
      { id: "blu2", name: "Blusa Modelo 2", img: "/images/models/blusa-2.png" },
    ],
   
    arts: {
      blu1: Array.from({ length: 10 }, (_, i) => ({
        id: `blu1_art${i + 1}`,
        name: `Arte Blu1 #${i + 1}`,
      })),
      blu2: Array.from({ length: 10 }, (_, i) => ({
        id: `blu2_art${i + 1}`,
        name: `Arte Blu2 #${i + 1}`,
      })),
    },
  },
};
