// @ts-ignore
/* eslint-disable */

declare namespace API {
  type User = {
    id?: number;
    code?: string;
    cn?: string;
    title?: string;
    deptId?: number;
    sAMAccount?: string;
    entryDate?: string;
    resignDate?: string;
    gender?: string;
    location?: string;
    resourceType?: string;
    privilege?: number;
    status?: number;
    token?: string;

    key?: number; // for list key
  };

  type Result = {
    success?: boolean;
    data?: any;
    errorMessage?: string;
  };

  type Assignment = {
    id?: number;
    userId: number;
    cn?: string;
    programId: number;
    deptId: number;
    allocation: number;
    allocationTime: string;
    approval?: boolean;
    status: number;
  };

  type AssignmentStatusPayload = {
    id: number;
    status: number;
  };

  type Program = {
    id: number;
    code?: number;
    type?: string;
    name?: string;
    userId?: number;
    closeDate?: string;
    status?: string;
    subprograms?: string;
    activities?: string;

    key?: number; // for list key
  };

  type Subprogram = {
    id: number;
    name?: string;
    status?: boolean;
  };

  type Activity = {
    id: number;
    name?: string;
    status?: boolean;
  };

  type Department = {
    id?: number;
    name?: string;
    userId?: number;
    level?: string;
    parentId?: number;
    children?: Department[];

    key?: number; // for list
  };

  type LoginParams = {
    username?: string;
    password?: string;
  };
}
