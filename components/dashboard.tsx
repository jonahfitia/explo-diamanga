'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Users, LogOut, Lock, CheckCircle, Circle, Star } from 'lucide-react';
import { TopModal } from './top-modal';
const TOPS_DATA = {
  1: {
    title: "TOP 1 - Fampidirana",
    code: "WPD2025",
    instruction: "Tongasoa amin'ny iraka voalohany ! Tsy maintsy mahita ny valiny miafina amin'ity fanontaniana ity ianao: 'Izaho no boky voalohany ao amin'ny Baiboly, milaza ny fiandohana. Inona ny anarako ?'",
    correctAnswer: "Genesisy",
    theme: "from-blue-500 to-blue-600"
  },
  2: {
    title: "TOP 2 - Herim-po",
    code: "WPD2025",
    instruction: "Arahabaina nahavita ny TOP 1 ! Ankehitriny, vahaolana ity fanontaniana momba ny herim-po ity: 'Iza ny zatovolahy nandresy an'i Goliata tamin'ny antsamotady ?'",
    correctAnswer: "Davida",
    theme: "from-green-500 to-green-600"
  },
  3: {
    title: "TOP 3 - Fahendrena",
    code: "WPD2025",
    instruction: " Ity fanadinana ity dia manamarina ny fahendrenao: 'Iza ny mpanjaka tao Israely izay nalaza tamin'ny fahendrena lehibe sy nanorina ny tempoly tao Jerosalema ?'",
    correctAnswer: "Solomona",
    theme: "from-orange-500 to-orange-600"
  },
  4: {
    title: "TOP 4 - Fandresena Farany",
    code: "WPD2025",
    instruction: "Fanadinana farany ! Asehoy ny fahalalanao faratampony: 'Inona ny boky farany ao amin'ny Baiboly izay miresaka ny faminaniana ?'",
    correctAnswer: "apokalypsy",
    theme: "from-purple-500 to-purple-600"
  }
};


export function Dashboard() {
  const { user, patrouillageData, signOut, updatePatrouillageProgress } = useAuth();
  const [selectedTop, setSelectedTop] = useState<number | null>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      // Error handled in context
    }
  };

  const getTopStatus = (topNumber: number) => {
    if (!patrouillageData) return 'locked';

    if (patrouillageData.completedTops.includes(topNumber)) {
      return 'completed';
    } else if (topNumber === patrouillageData.currentTop) {
      return 'current';
    } else if (topNumber < patrouillageData.currentTop) {
      return 'available';
    } else {
      return 'locked';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'current':
        return <Star className="h-5 w-5 text-orange-500" />;
      case 'available':
        return <Circle className="h-5 w-5 text-blue-500" />;
      case 'locked':
      default:
        return <Lock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'current':
        return 'bg-orange-50 border-orange-200 hover:bg-orange-100';
      case 'available':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'locked':
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const completedTopsCount = patrouillageData?.completedTops.length || 0;
  const progressPercentage = (completedTopsCount / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">
                Patrouille {patrouillageData?.name || 'Chargement...'}
              </h1>
              <p className="text-sm text-gray-500">Grand Jeu #WPD2025</p>
            </div>
          </div>

          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Déconnexion</span>
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Overview */}
        <Card className="mb-8 bg-white/80 backdrop-blur border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-6 w-6 text-orange-500" />
                  <span>Progression</span>
                </CardTitle>
                <CardDescription>
                  {completedTopsCount} / 4 TOP no vita
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {completedTopsCount}/4
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-sm text-gray-600 mt-2">
              {progressPercentage === 100 ?
                "🎉 Miarahaba ! Vitanareo izy rehetra !" :
                `Tohizo hatrany ! ${100 - progressPercentage}% sisa no mbola mila atao.`
              }
            </p>
          </CardContent>
        </Card>

        {/* TOPs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(TOPS_DATA).map(([topNumber, topData]) => {
            const num = parseInt(topNumber);
            const status = getTopStatus(num);
            const isAccessible = status === 'current' || status === 'available' || status === 'completed';

            return (
              <Card
                key={num}
                className={`relative transition-all duration-300 ${getStatusColor(status)} ${isAccessible ? 'cursor-pointer transform hover:scale-105 hover:shadow-lg' : 'cursor-not-allowed opacity-75'
                  } border-2`}
                onClick={() => isAccessible && setSelectedTop(num)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    {getStatusIcon(status)}
                    {status === 'completed' && (
                      <Badge className="bg-green-600 hover:bg-green-600 text-white">
                        Complété
                      </Badge>
                    )}
                    {status === 'current' && (
                      <Badge className="bg-orange-500 hover:bg-orange-500 text-white">
                        En cours
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {topData.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`w-full h-2 rounded-full bg-gradient-to-r ${topData.theme} opacity-80`} />
                  {status === 'locked' && (
                    <p className="text-sm text-gray-500 mt-3">
                      Complétez les TOPs précédents pour débloquer
                    </p>
                  )}
                  {isAccessible && (
                    <p className="text-sm text-gray-600 mt-3">
                      Cliquez pour {status === 'completed' ? 'revoir' : 'commencer'} cette épreuve
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Instructions */}
        <Card className="mt-8 bg-gradient-to-r from-blue-600 to-green-600 text-white border-0">
          <CardHeader>
            <CardTitle className="text-white">Torolalana</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-blue-50">
            <p>• Ny TOP tsirairay dia mila kaody miafina mba hidirana</p>
            <p>• Vakio tsara ny torolalana amin'ny fanadinana tsirairay</p>
            <p>• Ampidiro ny valiny marina mba hiroso amin'ny TOP manaraka</p>
            <p>• Voatahiry ho azy ny fandrosoanao</p>
          </CardContent>

        </Card>
      </div>

      {/* TOP Modal */}
      {selectedTop && (
        <TopModal
          topNumber={selectedTop}
          topData={TOPS_DATA[selectedTop as keyof typeof TOPS_DATA]}
          isOpen={!!selectedTop}
          onClose={() => setSelectedTop(null)}
          patrouillageData={patrouillageData}
          onUpdateProgress={updatePatrouillageProgress}
        />
      )}
    </div>
  );
}