export const pokemonCardStyles = {
  button:
    'relative block h-36 w-full overflow-hidden rounded-[1.75rem] p-4 text-left shadow-md transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20',
  content: 'relative z-10 flex h-full flex-col justify-between',
  name: 'text-lg font-bold capitalize text-white drop-shadow-sm',
  imageWrapper: 'absolute bottom-1 right-1 h-24 w-24',
  image: 'h-full w-full object-contain drop-shadow-lg',
} as const
