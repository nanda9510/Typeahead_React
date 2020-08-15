import { useState, useEffect, useRef } from "react";
import React from "react";
import PropTypes from "prop-types";
import "./Typeahead.css";

Typeahead.propTypes = {
  list: PropTypes.array.isRequired,
};

export default function Typeahead(props) {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [togglelist, setTogglelist] = useState("none");
  //Refs to control the input element and to handle click outside the input
  const inputRef = useRef();
  const outsideRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (outsideRef.current && !outsideRef.current.contains(event.target)) {
        setTogglelist("none");
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [outsideRef]);
  // Function that runs when an input value is changed
  const handleChange = (e) => {
    setInput(e.target.value.trim());

    let filtered = [];
    if (e.target.value) {
      filtered = props.list.filter((a) => {
        return (
          a.slice(0, e.target.value.trim().length).toLowerCase() ===
          e.target.value.trim().toLowerCase()
        );
      });
    }
    setResults(filtered);

    filtered.length > 0 ? setTogglelist("block") : setTogglelist("none");
  };

  // Function that runs when a list item is clicked
  const onClick = (val) => {
    setInput(val);
    setTogglelist("none");
  };

  const onEnter = (e, val, index) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      setInput(val);
      setTogglelist("none");
      inputRef.current.focus();
    }

    if (e.keyCode === 9 && !e.shiftKey && index === results.length - 1) {
      e.preventDefault();
    }
  };

  // Function that runs when a key is pressed while on input field

  const onKeyDown = (e) => {
    if (e.keyCode === 9 && !e.shiftKey) {
      if (!input || results.length === 0) {
        e.preventDefault();
        inputRef.current.blur();
      }
    }
    if (e.keyCode === 9 && e.shiftKey) {
      e.preventDefault();
      if (!input || results.length === 0) {
        inputRef.current.blur();
      }
    } else if (e.keyCode === 27) {
      setTogglelist("none");
    }
  };

  return (
    <div className="outer">
      <div className="form">
        <h4 className="heading">Color picker</h4>
        <div ref={outsideRef} className="color">
          <input
            type="text"
            ref={inputRef}
            placeholder="enter the color"
            spellCheck="false"
            value={input}
            onKeyDown={onKeyDown}
            onChange={handleChange}
          />

          <ul style={{ display: togglelist }}>
            {results.map((val, index) => {
              let val1 = val.slice(0, input.length);
              let val2 = val.slice(input.length);

              return (
                <li
                  onClick={() => onClick(val)}
                  tabIndex="0"
                  onKeyDown={(e) => onEnter(e, val, index)}
                  key={index}
                >
                  <strong>{val1}</strong>

                  <span>{val2}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
