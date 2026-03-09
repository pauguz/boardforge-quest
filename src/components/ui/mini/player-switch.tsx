import React from 'react'
import { Switch } from "@/components/ui/switch";

interface Props {
  plyr:number;
  change: any;
  blocking: boolean;
}

const PlayerSwitch = ({plyr, change, blocking}:Props) => {
  return (
    <div className="flex items-center gap-2 text-sm">
    <span className={plyr === 1 ? "text-player1 font-semibold" : "text-muted-foreground"}>J1</span>
    <Switch checked={plyr === 2}
      onCheckedChange={v => change(v ? 2 : 1)}
      disabled={blocking} />
    <span className={plyr === 2 ? "text-player2 font-semibold" : "text-muted-foreground"}>J2</span>
  </div>
  )
}

export {PlayerSwitch};
