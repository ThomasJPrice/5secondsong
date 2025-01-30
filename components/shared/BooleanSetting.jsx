'use client'

import React, { useState } from 'react'
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { changeBooleanSetting } from '@/actions/settings';

const BooleanSetting = ({ initialValue, name, description, title }) => {
  const [checked, setChecked] = useState(initialValue || false)

  async function onCheckedChange() {
    setChecked(!checked)

    await changeBooleanSetting(name, !checked)
  }
  
  return (
    <div className="flex items-center justify-between space-x-4 rounded-lg border p-4 shadow-sm">
      <div className="space-y-0.5">
        <Label htmlFor={title} className="text-base">
          {title}
        </Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch id={title} checked={checked} onCheckedChange={onCheckedChange} aria-label={title} />
    </div>
  )
}

export default BooleanSetting