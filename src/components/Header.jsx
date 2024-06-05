import logo from "../assets/troll.svg";

export default function Header() {
  return (
    <div className="header">
      <img src={logo} alt="troll face" />
      <h1>Meme Generator</h1>
      <span>Let's Troll</span>
    </div>
  );
}
