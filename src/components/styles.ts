export const styles = {
  base: {
    container:
      "max-width: 1200px; margin: 0 auto; padding: 2rem; background: #fafafa;",
    section:
      "padding: 6rem 2rem; background: linear-gradient(to bottom right, #ffffff, #f8fafc);",
    grid: "display: grid; gap: 2.5rem; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));",

    title:
      "font-size: 3.5rem; font-weight: 800; background: linear-gradient(to right, #1e293b, #334155); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1.5rem; line-height: 1.1;",
    subtitle:
      "font-size: 2rem; font-weight: 700; color: #334155; margin-bottom: 1rem; letter-spacing: -0.025em;",
    text: "font-size: 1.125rem; color: #64748b; line-height: 1.8; font-weight: 400;",

    button: {
      primary:
        "padding: 1rem 2rem; background: linear-gradient(to right, #3b82f6, #2563eb); color: white; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3); hover:transform: translateY(-2px); hover:box-shadow: 0 15px 20px -3px rgba(59, 130, 246, 0.4);",
      secondary:
        "padding: 1rem 2rem; background: rgba(255,255,255,0.8); color: #1e293b; border: 2px solid #e2e8f0; border-radius: 12px; font-weight: 600; backdrop-filter: blur(10px); transition: all 0.3s ease; hover:border-color: #3b82f6; hover:transform: translateY(-2px);",
      outline:
        "padding: 1rem 2rem; background: transparent; color: #3b82f6; border: 2px solid #3b82f6; border-radius: 12px; font-weight: 600; transition: all 0.3s ease; hover:background: #3b82f6; hover:color: white;",
    },

    card: {
      default:
        "background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); hover:transform: translateY(-5px); hover:box-shadow: 0 25px 30px -5px rgba(0, 0, 0, 0.1);",
      glass:
        "background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); border-radius: 16px; padding: 2rem; border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);",
      gradient:
        "background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 16px; padding: 2rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);",
    },

    link: "color: #3b82f6; text-decoration: none; font-weight: 500; transition: all 0.2s ease; position: relative; hover:color: #1d4ed8; after:content: ''; after:position: absolute; after:bottom: -2px; after:left: 0; after:width: 100%; after:height: 2px; after:background: currentColor; after:transform: scaleX(0); after:transition: transform 0.3s ease; hover:after:transform: scaleX(1);",

    grid2:
      "display: grid; grid-template-columns: repeat(2, 1fr); gap: 2.5rem; @media (max-width: 768px) { grid-template-columns: 1fr; }",
    grid3:
      "display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); } @media (max-width: 640px) { grid-template-columns: 1fr; }",
    grid4:
      "display: grid; grid-template-columns: repeat(4, 1fr); gap: 2.5rem; @media (max-width: 1280px) { grid-template-columns: repeat(3, 1fr); } @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); } @media (max-width: 640px) { grid-template-columns: 1fr; }",
    flex: "display: flex; gap: 2rem; align-items: center; flex-wrap: wrap;",

    effects: {
      glassmorphism:
        "background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2);",
      gradient:
        "background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);",
      shadowLg:
        "box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);",
      hover:
        "transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); hover:transform: translateY(-5px);",
    },
  },
};
