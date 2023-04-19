import React from "react";

interface SwitchboardProps {
  attributes: string[];
  onToggle: (attribute: string, isEnabled: boolean) => void;
}

export const Switchboard: React.FC<SwitchboardProps> = ({ attributes, onToggle }) => {
  const handleToggle = (attribute: string, event: React.ChangeEvent<HTMLInputElement>) => {
    onToggle(attribute, event.target.checked);
  };

  return (
    <>
      SELECT ATTRIBUTES TO DISPLAY:
      <div className="switchboard spaceship-display-screen">
        {attributes.map(attribute => (
          <div key={attribute} className="toggle-container">
            <label className="switch">
              <input type="checkbox" onChange={event => handleToggle(attribute, event)} />
              <span className="slider"></span>
            </label>
            <span className="attribute-label">{attribute}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default Switchboard;
