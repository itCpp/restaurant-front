import "./spinner.css";

const Spinner = props => {

    const className = ["spinner"];

    if (props.size === "mini") className.push("mini");
    else if (props.size === "tiny") className.push("tiny");
    else if (props.size === "small") className.push("small");
    else if (props.size === "large") className.push("large");
    else if (props.size === "big") className.push("big");

    return <svg className={className.join(" ")} viewBox="0 0 50 50">
        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="3"></circle>
    </svg>

}

export default Spinner;