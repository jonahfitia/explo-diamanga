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
    title: "Fanamiana",
    code: "FANEVA",
    instruction: "Lazao ny anaran’ny lokon’ny lobaka Class B amin’ny fanamian'ny mpisava lalana ?",
    correctAnswer: "Khaki",
    theme: "from-yellow-700 to-yellow-800"
  },
  2: {
    title: "Loko Saina",
    code: "COULEUR",
    instruction: "Inona ny loko voalohany hita amin'ny zoro ambony havia amin'ny sainan'ny Mpisava Lalana ?",
    correctAnswer: "Manga",
    theme: "from-blue-500 to-indigo-600"
  },
  3: {
    title: "Sary Famantarana ny mpisava lalana",
    code: "ENDRIKA",
    instruction: "Inona ny fitaovam-piarovana hita eo afovoan'ny Sary Famantarana ny mpisava lalana ?",
    correctAnswer: "Ampinga",
    theme: "from-purple-500 to-purple-600"
  },
  4: {
    title: "Hira Faneva",
    code: "FANEVA",
    instruction: "Iza no nanoratra ny hira fanevan'ny Mpisava Lalana tamin'ny 1948 ?",
    correctAnswer: "Henry Bergh",
    theme: "from-orange-500 to-orange-600"
  },
  5: {
    title: "Hevitry ny Loko",
    code: "LAFOVIDY",
    instruction: "Inona no asehon’ny loko ranom-bolamena amin'ny sainan'ny Mpisava Lalana ?",
    correctAnswer: "Finoana",
    theme: "from-yellow-500 to-yellow-600"
  },
  6: {
    title: "Kilasy Pandrosoana",
    code: "KILASY",
    instruction: "Firy ny mari-pandrosoana misy ao amin'ny Mpisava Lalana ?",
    correctAnswer: "6",
    theme: "from-teal-500 to-teal-600"
  },
  7: {
    title: "Tantara",
    code: "HISTORY",
    instruction: "Tamin'ny taona firy no natsangana tamin'ny fomba ofisialy ny Club Pathfinder ?",
    correctAnswer: "1950",
    theme: "from-pink-500 to-pink-600"
  },
  8: {
    title: "Hevitry ny Loko",
    code: "LOKO50",
    instruction: "Inona no asehon’ny loko fotsy amin'ny sainan'ny Mpisava Lalana ?",
    correctAnswer: "Fahadiovana",
    theme: "from-gray-200 to-gray-400"
  },
  9: {
    title: "Sainan'ny Mpisava",
    code: "SAINA4",
    instruction: "Firy metatra ny sakany amin'ny sainan'ny Mpisava Lalana ?",
    correctAnswer: "1",
    theme: "from-stone-500 to-stone-600"
  },
  10: {
    title: "Hevitry ny Loko",
    code: "LOKO10",
    instruction: "Inona no asehon’ny loko mena amin'ny sainan'ny Mpisava Lalana ?",
    correctAnswer: "Rà",
    theme: "from-red-500 to-red-600"
  },
  11: {
    title: "Sary Famantarana ny mpisava lalana",
    code: "LOGO16",
    instruction: "Inona ny fitaovam-piadiana hita eo afovoan'ny Sary famantarana ny mpisava lalana ?",
    correctAnswer: "Sabatra",
    theme: "from-green-500 to-green-600"
  },
  12: {
    title: "Tantara",
    code: "CLASSP",
    instruction: "Tamin’ny taona firy no natomboka voalohany ny kilasim-pandrosoana Pathfinder ?",
    correctAnswer: "1922",
    theme: "from-amber-500 to-amber-600"
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
  const totalTops = Object.keys(TOPS_DATA).length;
  const progressPercentage = (completedTopsCount / totalTops) * 100;

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
                  {completedTopsCount} / {totalTops} TOP no vita
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {completedTopsCount}/{totalTops}
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
