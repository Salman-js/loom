import { cn } from '@/lib/utils';

interface Props {
  max: number;
  value: number;
  min: number;
  gaugePrimaryClassName?: string;
  gaugeSecondaryClassName?: string;
  className?: string;
  textClassName?: string;
  suffixClassName?: string;
  suffix?: string;
}

export default function AnimatedCircularProgressBar({
  max = 100,
  min = 0,
  value = 0,
  gaugePrimaryClassName,
  gaugeSecondaryClassName,
  className,
  textClassName,
  suffixClassName,
  suffix,
}: Props) {
  const circumference = 2 * Math.PI * 45;
  const percentPx = circumference / 100;
  const currentPercent = Math.round(((value - min) / (max - min)) * 100);

  return (
    <div
      className={cn('relative size-20 text-2xl font-semibold', className)}
      style={
        {
          '--circle-size': '100px',
          '--circumference': circumference,
          '--percent-to-px': `${percentPx}px`,
          '--gap-percent': '5',
          '--offset-factor': '0',
          '--transition-length': '1s',
          '--transition-step': '200ms',
          '--delay': '0s',
          '--percent-to-deg': '3.6deg',
          transform: 'translateZ(0)',
        } as React.CSSProperties
      }
    >
      <svg
        fill='none'
        className='size-full'
        strokeWidth='2'
        viewBox='0 0 100 100'
      >
        {currentPercent <= 90 && currentPercent >= 0 && (
          <circle
            cx='50'
            cy='50'
            r='45'
            strokeWidth='10'
            strokeDashoffset='0'
            strokeLinecap='round'
            strokeLinejoin='round'
            className={cn(
              'opacity-100 stroke-muted-foreground',
              gaugeSecondaryClassName
            )}
            style={
              {
                '--stroke-percent': 90 - currentPercent,
                '--offset-factor-secondary': 'calc(1 - var(--offset-factor))',
                strokeDasharray:
                  'calc(var(--stroke-percent) * var(--percent-to-px)) var(--circumference)',
                transform:
                  'rotate(calc(1turn - 90deg - (var(--gap-percent) * var(--percent-to-deg) * var(--offset-factor-secondary)))) scaleY(-1)',
                transition: 'all var(--transition-length) ease var(--delay)',
                transformOrigin:
                  'calc(var(--circle-size) / 2) calc(var(--circle-size) / 2)',
              } as React.CSSProperties
            }
          />
        )}
        <circle
          cx='50'
          cy='50'
          r='45'
          strokeWidth='10'
          strokeDashoffset='0'
          strokeLinecap='round'
          strokeLinejoin='round'
          className={cn('opacity-100 stroke-foreground', gaugePrimaryClassName)}
          style={
            {
              '--stroke-percent': currentPercent,
              strokeDasharray:
                'calc(var(--stroke-percent) * var(--percent-to-px)) var(--circumference)',
              transition:
                'var(--transition-length) ease var(--delay),stroke var(--transition-length) ease var(--delay)',
              transitionProperty: 'stroke-dasharray,transform',
              transform:
                'rotate(calc(-90deg + var(--gap-percent) * var(--offset-factor) * var(--percent-to-deg)))',
              transformOrigin:
                'calc(var(--circle-size) / 2) calc(var(--circle-size) / 2)',
            } as React.CSSProperties
          }
        />
      </svg>
      <span
        data-current-value={currentPercent}
        className={cn(
          'duration-[var(--transition-length)] delay-[var(--delay)] absolute inset-0 m-auto size-fit ease-linear animate-in fade-in flex flex-row justify-center items-end',
          textClassName
        )}
      >
        {currentPercent}{' '}
        <span className={cn('text-sm', suffixClassName)}>{suffix}</span>
      </span>
    </div>
  );
}
