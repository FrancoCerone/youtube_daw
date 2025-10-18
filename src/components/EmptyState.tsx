import React from 'react';
import { motion } from 'framer-motion';
import { Music2, Youtube, MousePointerClick } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="max-w-2xl text-center space-y-6">
        <div className="flex items-center justify-center gap-4 mb-8">
          <Music2 size={48} className="text-blue-400" />
          <Youtube size={48} className="text-red-500" />
        </div>
        
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Benvenuto in YouTube DAW!
        </h2>
        
        <p className="text-gray-400 text-lg">
          Inizia a creare la tua composizione aggiungendo video YouTube
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl font-bold text-blue-400">1</span>
            </div>
            <h3 className="font-semibold mb-2">Aggiungi Video</h3>
            <p className="text-sm text-gray-400">
              Clicca "Add YouTube" e incolla l'URL di un video - vedrai il video nella clip!
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <MousePointerClick className="text-purple-400" size={24} />
            </div>
            <h3 className="font-semibold mb-2">Sposta & Modifica</h3>
            <p className="text-sm text-gray-400">
              Trascina le clip sulla timeline e imposta trim start/end
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="bg-green-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">▶️</span>
            </div>
            <h3 className="font-semibold mb-2">Riproduci</h3>
            <p className="text-sm text-gray-400">
              Usa i controlli per riprodurre la tua composizione
            </p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-300">
            💡 <strong>Tip:</strong> Prova con questi URL di esempio
          </p>
          <div className="mt-2 space-y-1 text-xs text-gray-400 font-mono">
            <div>• https://www.youtube.com/watch?v=dQw4w9WgXcQ</div>
            <div>• https://www.youtube.com/watch?v=jNQXAC9IVRw</div>
            <div>• Vedrai il video YouTube direttamente nella clip!</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmptyState;

