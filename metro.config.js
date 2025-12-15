const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

if (process.env.NODE_ENV === 'development') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const message = args.join(' ');
    
    if (
      message.includes('shadow*" style props are deprecated') ||
      message.includes('props.pointerEvents is deprecated')
    ) {
      return;
    }
    
    originalWarn.apply(console, args);
  };
}

module.exports = config;