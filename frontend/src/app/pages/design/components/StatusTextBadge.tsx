import { DesignStatus, DesignStatusColor, DesignStatusText } from "../interfaces";

export const DesignStatusTextBadge = ({ status }: { status: DesignStatus }) => (
  <span
    className="badge rounded-pill"
    style={{
      fontSize: ".9em",
      color: "black",
      backgroundColor: DesignStatusColor[status],
    }}
  >
    {DesignStatusText[status]}
  </span>
);
