'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Lock, Key, FileText, CheckCircle, AlertCircle, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface TopModalProps {
  topNumber: number;
  topData: {
    title: string;
    code: string;
    instruction: string;
    correctAnswer: string;
    theme: string;
  };
  isOpen: boolean;
  onClose: () => void;
  patrouillageData: any;
  onUpdateProgress: (topNumber: number, progress: any) => Promise<void>;
}

export function TopModal({ topNumber, topData, isOpen, onClose, patrouillageData, onUpdateProgress }: TopModalProps) {
  const [secretCode, setSecretCode] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const topProgress = patrouillageData?.topProgresses?.[topNumber];
  const isCompleted = topProgress?.completed || false;
  const codeEntered = topProgress?.codeEntered || false;
  const answerSubmitted = topProgress?.answerSubmitted || false;

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setSecretCode('');
      setAnswer('');
    }
  }, [isOpen]);

  const handleSecretCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretCode.trim()) {
      toast.error('Veuillez entrer le code secret');
      return;
    }

    setLoading(true);
    try {
      if (secretCode.toUpperCase() === topData.code.toUpperCase()) {
        await onUpdateProgress(topNumber, { codeEntered: true });
        toast.success('Code secret correct ! Instructions débloquées.');
        setSecretCode('');
      } else {
        toast.error('Code secret incorrect. Réessayez !');
      }
    } catch (error) {
      toast.error('Erreur lors de la vérification du code');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) {
      toast.error('Veuillez entrer votre réponse');
      return;
    }

    setLoading(true);
    try {
      const isCorrect = answer.toLowerCase().trim() === topData.correctAnswer.toLowerCase();
      
      if (isCorrect) {
        await onUpdateProgress(topNumber, { 
          answerSubmitted: true, 
          completed: true 
        });
        toast.success('🎉 Excellente réponse ! TOP complété !');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        toast.error('Réponse incorrecte. Réfléchissez encore !');
      }
      setAnswer('');
    } catch (error) {
      toast.error('Erreur lors de la vérification de la réponse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${topData.theme} flex items-center justify-center`}>
              <Star className="h-5 w-5 text-white" />
            </div>
            <span>{topData.title}</span>
            {isCompleted && (
              <Badge className="bg-green-600 hover:bg-green-600 text-white ml-auto">
                <CheckCircle className="h-3 w-3 mr-1" />
                Complété
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Phase 1: Code Secret */}
          <Card className={`${codeEntered ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                {codeEntered ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Lock className="h-5 w-5 text-blue-600" />
                )}
                <span>Étape 1: Code Secret</span>
              </CardTitle>
              <CardDescription>
                {codeEntered 
                  ? "Code secret validé ! Vous pouvez maintenant voir les instructions." 
                  : "Entrez le code secret pour débloquer les instructions de cette épreuve."
                }
              </CardDescription>
            </CardHeader>
            
            {!codeEntered && (
              <CardContent>
                <form onSubmit={handleSecretCodeSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="secret-code" className="flex items-center space-x-2">
                      <Key className="h-4 w-4" />
                      <span>Code Secret</span>
                    </Label>
                    <Input
                      id="secret-code"
                      type="text"
                      placeholder="Entrez le code secret..."
                      value={secretCode}
                      onChange={(e) => setSecretCode(e.target.value.toUpperCase())}
                      className="font-mono text-center text-lg tracking-wider"
                      disabled={loading}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'Vérification...' : 'Valider le Code'}
                  </Button>
                </form>
              </CardContent>
            )}
          </Card>

          {/* Phase 2: Instructions (shown only after code is entered) */}
          {codeEntered && (
            <>
              <Separator />
              
              <Card className={`${isCompleted ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <FileText className="h-5 w-5 text-orange-600" />
                    )}
                    <span>Étape 2: Mission</span>
                  </CardTitle>
                  <CardDescription>
                    {isCompleted 
                      ? "Mission accomplie avec succès !" 
                      : "Lisez attentivement les instructions et trouvez la bonne réponse."
                    }
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="bg-white p-4 rounded-lg border-l-4 border-orange-400 mb-4">
                    <p className="text-gray-800 leading-relaxed">
                      {topData.instruction}
                    </p>
                  </div>

                  {!isCompleted && (
                    <form onSubmit={handleAnswerSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="answer" className="flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4" />
                          <span>Votre Réponse</span>
                        </Label>
                        <Input
                          id="answer"
                          type="text"
                          placeholder="Entrez votre réponse..."
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          className="text-lg"
                          disabled={loading}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        disabled={loading}
                      >
                        {loading ? 'Vérification...' : 'Valider la Réponse'}
                      </Button>
                    </form>
                  )}

                  {isCompleted && (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-green-800 mb-2">
                        Mission Réussie !
                      </h3>
                      <p className="text-green-700">
                        Vous pouvez maintenant passer au TOP suivant.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Progress Indicator */}
          <div className="flex justify-center space-x-4">
            <div className={`flex items-center space-x-2 ${codeEntered ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-3 h-3 rounded-full ${codeEntered ? 'bg-green-600' : 'bg-gray-300'}`} />
              <span className="text-sm">Code</span>
            </div>
            <div className={`flex items-center space-x-2 ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}`} />
              <span className="text-sm">Mission</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}