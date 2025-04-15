import React from "react";

export default function Logo() {
  return (
    <div className="flex gap-2 items-center">
      <div className="flex items-center text-9xl text-indigo-600 leading-[9rem]">
        <i className="ti ti-heartbeat" aria-hidden="true" />
      </div>
      <h1 className="text-8xl font-semibold -tracking-wide leading-[7.5rem]">
        MedTrack
      </h1>
    </div>
  );
}
