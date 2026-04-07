import { Check, X } from 'lucide-react'
import { getPasswordStrength } from "./validation";

const REQUIREMENTS = [
  { key: 'length',    label: 'At least 8 characters'   },
  { key: 'uppercase', label: 'Uppercase letter (A–Z)'  },
  { key: 'lowercase', label: 'Lowercase letter (a–z)'  },
  { key: 'number',    label: 'Number (0–9)'             },
  { key: 'special',   label: 'Special character (!@#…)' },
]

export function PasswordStrengthBar({ password }) {
  if (!password) return null

  const { label, color, percent, checks } = getPasswordStrength(password)
  const filled = Math.round((percent / 100) * 5)

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {[1, 2, 3, 4, 5].map(s => (
            <div
              key={s}
              className="h-1.5 flex-1 rounded-full transition-all duration-500"
              style={{ backgroundColor: s <= filled ? color : 'rgba(255,255,255,0.08)' }}
            />
          ))}
        </div>
        <span
          className="w-20 text-xs font-semibold text-right transition-colors duration-300"
          style={{ color }}
        >
          {label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-0.5">
        {REQUIREMENTS.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-1.5">
            {checks[key]
              ? <Check size={12} className="text-emerald-400 shrink-0" />
              : <X     size={12} className="text-blue-400/40 shrink-0" />
            }
            <span className={`text-xs transition-colors duration-200 ${
              checks[key] ? 'text-emerald-400' : 'text-blue-300/50'
            }`}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

