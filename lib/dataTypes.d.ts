type TicketType = {
  userId: number;
  type: string;
  mode: string;
  asset: string;
  noOfTickets: number;
  amount: string;
  cover?: string;
  channel?: string;
  message?: string;
  password?: string;
};

interface ITicket {
  id: number;
  userId: number;
  type: string;
  mode: string;
  asset: string;
  noOfTickets: number;
  amount: string;
  cover: string;
  channel: string;
  message: string;
  checks: number[];
  unclaimed_checks: UnclaimedCheckType[];
  claimed_checks: ClaimedCheckType[];
}

export type UnclaimedCheckType = {
  amount: string;
};

type ClaimedCheckType = {
  amount: string;
  userId: number;
  username: string;
  checkId: number;
  url: string;
};

export { TicketType, ITicket };
