import { Link } from "react-router-dom";
import "./CustomerServicesNavComp.css";
import { customerServiceMenu } from "../../config/CustomerServiceMenu";

export default function CustomerServiceNav() {
  return (
    <div className="customer-service-nav">
      <h4>Customer Service</h4>
      <ul>
        {customerServiceMenu.map((item, index) => (
          <li key={index}>
            <Link to={item.link}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
