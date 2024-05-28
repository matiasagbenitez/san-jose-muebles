import {
  Status,
  StatusColor,
  DesignStatus,
  DesignStatusColor,
  Difficulty,
  DifficultyColor,
  Priority,
  PriorityColor,
} from "../interfaces";

export const StatusBadge = ({ status }: { status: Status }) => (
  <span
    className="badge rounded-pill"
    style={{
      fontSize: ".9em",
      color: "black",
      backgroundColor: StatusColor[status],
    }}
  >
    {status}
  </span>
);

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

export const DifficultyBadge = ({ status }: { status: Difficulty }) => (
  <span
    className="badge rounded-pill"
    style={{
      fontSize: ".9em",
      color: "black",
      backgroundColor: DifficultyColor[status],
    }}
  >
    {status}
  </span>
);

export const PriorityBadge = ({ status }: { status: Priority }) => (
  <span
    className="badge rounded-pill"
    style={{
      fontSize: ".9em",
      color: "black",
      backgroundColor: PriorityColor[status],
    }}
  >
    {status}
  </span>
);
