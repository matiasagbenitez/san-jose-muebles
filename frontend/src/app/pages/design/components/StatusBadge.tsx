import { DesignStatus, DesignStatusColor } from "../interfaces";

export const DesignStatusBadge = ({ status }: { status: DesignStatus }) => (
  <span
    className="badge rounded-pill"
    style={{
      fontSize: ".9em",
      color: "black",
      backgroundColor: DesignStatusColor[status],
    }}
  >
    {status}
  </span>
);
