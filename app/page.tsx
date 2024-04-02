"use client";

import Bill from "./Forms/Bill";
import Allocation from "./Forms/Allocation";
import Summary from "./Forms/Summary";

import { useAppState } from "./state";

import { useState } from "react";

export default function Home() {
  const [state] = useAppState();

  return (
    <div className="flex justify-center p-10">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold">Tabulate</h1>
          <p className="text-muted-foreground">
            Effortlessly split the tab with friends. Perfect for splitting
            itemized bills with discounts, taxes, and tips. Say goodbye to
            complicated spreadsheets 👋!
          </p>
        </div>

        {state.step === 0 ? <Bill></Bill> : null}
        {state.step === 1 ? <Allocation></Allocation> : null}
        {state.step === 2 ? <Summary></Summary> : null}
      </div>
    </div>
  );
}
