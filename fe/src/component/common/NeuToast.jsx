import { useEffect, useState } from 'react';
import { X, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import '../../style/neumorphism.css'; // Ensure we have the base variables if needed, or inline styles

const NeuToast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    info: <Info size={20} className="text-blue-500" />,
    success: <CheckCircle size={20} className="text-green-500" />,
    warning: <AlertTriangle size={20} className="text-yellow-500" />,
    error: <AlertTriangle size={20} className="text-red-500" />
  };

  return (
    <div 
        className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl bg-[#e0e5ec] text-[#3d4468] font-medium transition-all duration-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
        style={{
            boxShadow: '8px 8px 16px #bec3cf, -8px -8px 16px #ffffff'
        }}
    >
        <div className="flex-shrink-0">
            {icons[type]}
        </div>
        <div className="flex-1 min-w-[200px]">
            {message}
        </div>
        <button 
            onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }}
            className="p-1 rounded-full text-[#9499b7] hover:text-[#3d4468] transition-colors focus:outline-none"
        >
            <X size={16} />
        </button>
    </div>
  );
};

export default NeuToast;
