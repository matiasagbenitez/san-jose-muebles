import { DesignStatus, DesignStatuses } from "../interfaces";

interface Props {
  status: DesignStatus;
  className?: string;
}

export const DesignStatusSpan = ({ status, className }: Props) => (
  <span className={className}>
    <i className={DesignStatuses[status].icon}></i>
    {DesignStatuses[status].text}
  </span>
);
