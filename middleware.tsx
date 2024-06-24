"use server";
import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./api/userAPI";

export const middleware = (request: NextRequest) => {
  return updateSession(request);
};
