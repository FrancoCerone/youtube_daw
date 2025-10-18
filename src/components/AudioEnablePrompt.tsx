import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Info } from 'lucide-react';

interface AudioEnablePromptProps {
  show: boolean;
  onEnable: () => void;
}

const AudioEnablePrompt: React.FC<AudioEnablePromptProps> = ({ show, onEnable }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]"
          onClick={onEnable}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded-2xl max-w-md text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Volume2 size={40} className="text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">
              Abilita Audio
            </h2>
            
            <p className="text-white/90 mb-6 text-lg">
              Per riprodurre l'audio, il browser richiede un'interazione dell'utente.
            </p>

            <div className="bg-white/10 rounded-lg p-4 mb-6 flex items-start gap-3">
              <Info size={20} className="text-white/80 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-white/80 text-left">
                Questa è una policy di sicurezza dei browser per prevenire autoplay indesiderato.
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEnable}
              className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              🔊 Abilita Audio e Riproduci
            </motion.button>

            <p className="text-white/60 text-xs mt-4">
              Clicca il pulsante per continuare
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AudioEnablePrompt;

