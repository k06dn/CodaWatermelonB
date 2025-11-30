import { View, Text, TouchableOpacity } from 'react-native';
import { useState } from "react";
import { motion, AnimatePresence } from "react-native-reanimated";
import { Search, Share2, X, Star, MapPin, Eye, Volume2, Sun, AlertCircle, CheckCircle2, ThumbsUp, Navigation, Clock, Users, Lightbulb, ChevronLeft, ChevronRight, Info, ChevronDown, Filter, Map } from "lucide-react-native";
import { toast } from "react-native-toast-message";

interface Room {
  id: string;
  name: string;
  building: string;
  floor: string;
  capacity: number;
  overallRating: number;
  reviewCount: number;
  visualAccess: number;
  acoustics: number;
  lighting: number;
  seatingFlexibility: number;
  bslInterpreterSpace: boolean;
  captionDisplay: boolean;
  topTips: string[];
  bestSeats: string;
  avoid: string;
  lastUpdated: string;
  reviews: {
    id: string;
    author: string;
    authorType: "Deaf Student" | "Staff" | "HOH Student" | "BSL User";
    verified: boolean;
    date: string;
    rating: number;
    comment: string;
  }[];
}

const rooms: Room[] = [
  {
    id: "1",
    name: "Lecture Theatre A",
    building: "Engineering Building",
    floor: "Ground Floor",
    capacity: 120,
    overallRating: 4.5,
    reviewCount: 34,
    visualAccess: 92,
    acoustics: 68,
    lighting: 95,
    seatingFlexibility: 85,
    bslInterpreterSpace: true,
    captionDisplay: true,
    topTips: [
      "Front three rows have excellent visual access to the interpreter area",
      "Arrive early for seats A1-A5 for optimal lip reading distance",
      "Right side (near interpreter) is better than left for BSL users",
      "Avoid back two rows - too far for effective visual communication"
    ],
    bestSeats: "Rows A-B, seats 1-5 (central front section)",
    avoid: "Rows D-E (back rows), seats near the exit doors",
    lastUpdated: "2 days ago",
    reviews: [
      {
        id: "1",
        author: "Sarah M.",
        authorType: "Deaf Student",
        verified: true,
        date: "15 Oct 2024",
        rating: 5,
        comment: "Brilliant setup! Front row seating gives perfect sightline to both the lecturer and BSL interpreter. The interpreter zone is well-lit and positioned perfectly. I use this theatre for my Engineering lectures and always arrive 10 mins early to grab seat A3."
      },
      {
        id: "2",
        author: "Prof. David Chen",
        authorType: "Staff",
        verified: true,
        date: "8 Oct 2024",
        rating: 4,
        comment: "As a lecturer, I appreciate the acoustics for students using hearing aids. The caption display system is reliable. Only downside is the back rows are quite far from the stage - recommend Deaf students sit in rows A-C."
      },
      {
        id: "3",
        author: "Anonymous",
        authorType: "Deaf Student",
        verified: false,
        date: "10 Oct 2024",
        rating: 5,
        comment: "👍"
      },
      {
        id: "4",
        author: "Anonymous",
        authorType: "HOH Student",
        verified: false,
        date: "3 Oct 2024",
        rating: 4,
        comment: "i can hear my crush clearer from here wish me luck boyz"
      }
    ]
  },
  {
    id: "2",
    name: "Lecture Theatre B",
    building: "Darwin Building",
    floor: "First Floor",
    capacity: 80,
    overallRating: 3.8,
    reviewCount: 28,
    visualAccess: 78,
    acoustics: 72,
    lighting: 88,
    seatingFlexibility: 70,
    bslInterpreterSpace: true,
    captionDisplay: false,
    topTips: [
      "Tiered seating provides good sightlines from most positions",
      "Natural lighting from windows can cause glare on screens - best in afternoon",
      "Interpreter usually stands stage left",
      "Central aisle seats (rows B-C) offer good compromise"
    ],
    bestSeats: "Rows B-C, central aisle seats",
    avoid: "Window-side seats during morning lectures (glare)",
    lastUpdated: "5 days ago",
    reviews: [
      {
        id: "3",
        author: "Alice Johnson",
        authorType: "HOH Student",
        verified: true,
        date: "2023-10-03",
        rating: 3.5,
        comment: "Good visual access but acoustics could be better. No caption display."
      },
      {
        id: "4",
        author: "Bob Brown",
        authorType: "BSL User",
        verified: true,
        date: "2023-10-04",
        rating: 4.0,
        comment: "Interpreter space is available. Lighting is good."
      }
    ]
  },
  {
    id: "3",
    name: "Lecture Hall C",
    building: "Old Science Block",
    floor: "Ground Floor",
    capacity: 150,
    overallRating: 2.1,
    reviewCount: 47,
    visualAccess: 35,
    acoustics: 42,
    lighting: 48,
    seatingFlexibility: 25,
    bslInterpreterSpace: false,
    captionDisplay: false,
    topTips: [
      "Avoid this room if you have other options - very difficult for Deaf students",
      "Poor sightlines from most seats due to flat floor design",
      "Heavy echo makes hearing aids uncomfortable",
      "No designated space for interpreters - they stand awkwardly at the side"
    ],
    bestSeats: "Front row centre only (seats 8-12) - still not great",
    avoid: "Anywhere beyond row C, sides of the room, back sections",
    lastUpdated: "1 day ago",
    reviews: [
      {
        id: "5",
        author: "Marcus T.",
        authorType: "Deaf Student",
        verified: true,
        date: "18 Oct 2024",
        rating: 1,
        comment: "Honestly, avoid if you can. Flat floor means you can't see past the person in front of you. No interpreter space - mine had to stand to the side by the door. Echo is terrible with my hearing aids. Had to complain to disability services to get moved to a different room."
      },
      {
        id: "6",
        author: "Dr. Rebecca Walsh",
        authorType: "Staff",
        verified: true,
        date: "12 Oct 2024",
        rating: 2,
        comment: "Not suitable for Deaf students at all. I've raised this multiple times with the estates team. The room desperately needs renovation - poor acoustics, inadequate lighting, and zero consideration for accessibility. Would not recommend booking this space for lectures with Deaf attendees."
      },
      {
        id: "7",
        author: "Priya K.",
        authorType: "HOH Student",
        verified: false,
        date: "5 Oct 2024",
        rating: 3,
        comment: "It's okay if you sit right at the front, but that's the only option. Back rows are impossible - can't hear anything clearly and can't see the lecturer properly either."
      },
      {
        id: "8",
        author: "Anonymous",
        authorType: "Deaf Student",
        verified: false,
        date: "2 Oct 2024",
        rating: 1,
        comment: "so bad lol"
      },
      {
        id: "9",
        author: "Anonymous",
        authorType: "HOH Student",
        verified: false,
        date: "29 Sep 2024",
        rating: 2,
        comment: "avoid if possible honestly"
      }
    ]
  },
  {
    id: "4",
    name: "Seminar Room 3A",
    building: "Humanities Block",
    floor: "Third Floor",
    capacity: 24,
    overallRating: 4.8,
    reviewCount: 19,
    visualAccess: 96,
    acoustics: 85,
    lighting: 92,
    seatingFlexibility: 95,
    bslInterpreterSpace: false,
    captionDisplay: true,
    topTips: [
      "U-shaped table layout - everyone can see each other perfectly",
      "Small group setting ideal for Deaf students",
      "Excellent natural lighting throughout the day",
      "Easy to request seat changes for optimal positioning"
    ],
    bestSeats: "Any seat at the curved section (optimal visibility)",
    avoid: "Corners of the U (limited peripheral view)",
    lastUpdated: "1 week ago",
    reviews: [
      {
        id: "7",
        author: "Ethan Foster",
        authorType: "Deaf Student",
        verified: true,
        date: "2023-10-07",
        rating: 5.0,
        comment: "Perfect visual access and acoustics. Caption display is excellent."
      },
      {
        id: "8",
        author: "Fiona Green",
        authorType: "Staff",
        verified: true,
        date: "2023-10-08",
        rating: 4.5,
        comment: "Lighting is great. Seating flexibility is high."
      }
    ]
  },
  {
    id: "5",
    name: "Library Study Room G10",
    building: "Main Library",
    floor: "Ground Floor",
    capacity: 6,
    overallRating: 5.0,
    reviewCount: 42,
    visualAccess: 98,
    acoustics: 90,
    lighting: 96,
    seatingFlexibility: 100,
    bslInterpreterSpace: false,
    captionDisplay: false,
    topTips: [
      "Glass walls provide excellent visibility for visual communication",
      "Circular table - no bad seats!",
      "Highly rated by Deaf students for group work",
      "Bookable in advance through library portal"
    ],
    bestSeats: "All seats equally excellent",
    avoid: "N/A - all positions are great",
    lastUpdated: "3 days ago",
    reviews: [
      {
        id: "9",
        author: "George Hall",
        authorType: "Deaf Student",
        verified: true,
        date: "2023-10-09",
        rating: 5.0,
        comment: "Excellent visual access and acoustics. No interpreter space needed."
      },
      {
        id: "10",
        author: "Hannah Ian",
        authorType: "Staff",
        verified: true,
        date: "2023-10-10",
        rating: 4.5,
        comment: "Lighting is great. Seating flexibility is high."
      }
    ]
  },
];

interface SensoryScoutRoomProps {
  onBack?: () => void;
}

export function SensoryScoutRoom({ onBack }: SensoryScoutRoomProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showAddReview, setShowAddReview] = useState(false);
  const [showMetricInfo, setShowMetricInfo] = useState<string | null>(null);
  const [showReviews, setShowReviews] = useState(false);
  const [studentType, setStudentType] = useState<"Deaf Student" | "HOH Student">("Deaf Student");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showSeatFinder, setShowSeatFinder] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({
    usesBSL: null as boolean | null,
    lipsReads: null as boolean | null,
    preference: null as "front" | "middle" | "back" | null,
  });
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sortBy, setSortBy] = useState<"rating" | "bsl" | "recent">("rating");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  const metricExplanations = {
    "Visual Access": "How easy it is to see the lecturer, interpreter, captions, and other students. Good visual access means clear sightlines.",
    "Acoustics": "How well you can hear speech and sounds in the room. Good acoustics mean less echo and background noise.",
    "Lighting": "How bright and even the lighting is. Good lighting helps with lip reading and seeing sign language clearly.",
    "Seating Flexibility": "How easy it is to move seats or choose where to sit. Good flexibility means you can pick the best spot for you."
  };

  const getRatingInfo = (rating: number) => {
    if (rating >= 85) return { label: "Excellent", color: "#10B981", emoji: "🟢" };
    if (rating >= 70) return { label: "Good", color: "#3B82F6", emoji: "🔵" };
    if (rating >= 50) return { label: "Okay", color: "#F59E0B", emoji: "🟡" };
    return { label: "Bad", color: "#EF4444", emoji: "🔴" };
  };

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.building.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShare = (room: Room) => {
    // Just show a toast message - don't try to use clipboard API
    toast.success(`Sharing ${room.name}`, {
      description: `${room.building} · Rating: ${room.overallRating}/5`
    });
  };

  const handleAddReview = () => {
    setShowAddReview(false);
    toast.success("Review submitted!", {
      description: "Thank you for helping the Deaf student community"
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 90) return "#10B981";
    if (rating >= 75) return "#3B82F6";
    if (rating >= 60) return "#F59E0B";
    return "#EF4444";
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 90) return "Excellent";
    if (rating >= 75) return "Good";
    if (rating >= 60) return "Fair";
    return "Poor";
  };

  if (selectedRoom) {
    return (
      <View className="h-full flex flex-col bg-[#FFFBF5]">
        {/* Header */}
        <View className="px-6 pt-6 pb-4 border-b border-[#6B5CAC]/10">
          <View className="flex items-center gap-3 mb-3">
            <button
              onPress={() => setSelectedRoom(null)}
              className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-xl border border-white/80 flex items-center justify-center hover:bg-white/80 transition-colors"
              aria-label="Back to room list"
            >
              <ChevronLeft className="w-5 h-5 text-[#2A0098]" strokeWidth={2.5} />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-[#2A0098]">{selectedRoom.name}</Text>
              <Text className="text-[#6B5CAC] text-sm">{selectedRoom.building} · {selectedRoom.floor}</Text>
            </View>
            <button
              onPress={() => handleShare(selectedRoom)}
              className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-xl border border-white/80 flex items-center justify-center hover:bg-white/80 transition-colors"
              aria-label="Share room details"
            >
              <Share2 className="w-4 h-4 text-[#2A0098]" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          {/* Overall Rating */}
          <View className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/80 shadow-md">
            <View className="flex items-center justify-between">
              <div>
                <View className="flex items-center gap-2 mb-1">
                  <Text className="text-[#2A0098]" style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1 }}>
                    {selectedRoom.overallRating}
                  </Text>
                  <div>
                    <View className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(selectedRoom.overallRating)
                              ? 'fill-[#F59E0B] text-[#F59E0B]'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                          strokeWidth={1.5}
                        />
                      ))}
                    </View>
                    <Text className="text-[#6B5CAC] text-xs mt-0.5">{selectedRoom.reviewCount} reviews</Text>
                  </View>
                </View>
              </View>
              <View className="text-right">
                <View className="flex items-center gap-2 text-[#6B5CAC] text-xs mb-1">
                  <Users className="w-3 h-3" strokeWidth={2.5} />
                  <span>Capacity: {selectedRoom.capacity}</Text>
                </View>
                <View className="flex items-center gap-2 text-[#6B5CAC] text-xs">
                  <Clock className="w-3 h-3" strokeWidth={2.5} />
                  <span>Updated {selectedRoom.lastUpdated}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="flex-1 overflow-y-auto px-6 py-4">
          {/* Accessibility Metrics */}
          <View className="mb-6">
            <Text className="text-[#2A0098] mb-3" style={{ fontWeight: 700 }}>Accessibility Metrics</Text>
            <View className="grid grid-cols-2 gap-3">
              {[
                { label: "Visual Access", value: selectedRoom.visualAccess, icon: Eye },
                { label: "Acoustics", value: selectedRoom.acoustics, icon: Volume2 },
                { label: "Lighting", value: selectedRoom.lighting, icon: Sun },
                { label: "Seating Flexibility", value: selectedRoom.seatingFlexibility, icon: Navigation },
              ].map((metric) => {
                const Icon = metric.icon;
                const ratingInfo = getRatingInfo(metric.value);
                
                return (
                  <View key={metric.label} className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/80 shadow-sm">
                    <View className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-[#2A0098]" strokeWidth={2.5} />
                      <Text className="text-[#6B5CAC] text-xs" style={{ fontWeight: 600 }}>{metric.label}</Text>
                      <button
                        onPress={() => setShowMetricInfo(metric.label)}
                        className="w-4 h-4 rounded-full bg-[#6B5CAC]/10 flex items-center justify-center hover:bg-[#6B5CAC]/20 transition-colors"
                        aria-label={`Info about ${metric.label}`}
                      >
                        <Info className="w-3 h-3 text-[#6B5CAC]" strokeWidth={2.5} />
                      </TouchableOpacity>
                    </View>
                    <View className="flex items-end gap-2">
                      <Text className="text-[#2A0098] text-2xl" style={{ fontWeight: 700, lineHeight: 1 }}>
                        {metric.value}%
                      </Text>
                      <Text className="text-xs pb-0.5" style={{ color: ratingInfo.color, fontWeight: 600 }}>
                        {ratingInfo.label}
                      </Text>
                    </View>
                    <View className="mt-2 h-2 bg-[#2A0098]/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${metric.value}%`, background: ratingInfo.color }}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Features */}
          <View className="mb-6">
            <Text className="text-[#2A0098] mb-3" style={{ fontWeight: 700 }}>Features</Text>
            <View className="flex gap-2 flex-wrap">
              {selectedRoom.bslInterpreterSpace && (
                <View className="px-3 py-2 bg-[#6B5CAC]/10 border border-[#6B5CAC]/20 rounded-xl text-[#2A0098] text-xs backdrop-blur-xl" style={{ fontWeight: 600 }}>
                  <CheckCircle2 className="w-3 h-3 inline-block mr-1.5" strokeWidth={2.5} />
                  BSL Interpreter Space
                </View>
              )}
              {selectedRoom.captionDisplay && (
                <View className="px-3 py-2 bg-[#FF85A2]/10 border border-[#FF85A2]/20 rounded-xl text-[#2A0098] text-xs backdrop-blur-xl" style={{ fontWeight: 600 }}>
                  <CheckCircle2 className="w-3 h-3 inline-block mr-1.5" strokeWidth={2.5} />
                  Caption Display
                </View>
              )}
            </View>
          </View>

          {/* Best Seats */}
          <View className="mb-6">
            <Text className="text-[#2A0098] mb-3" style={{ fontWeight: 700 }}>Best Seats</Text>
            <View className="bg-[#10B981]/10 border border-[#10B981]/20 backdrop-blur-xl rounded-2xl p-4">
              <View className="flex items-start gap-3">
                <View className="w-8 h-8 rounded-full bg-[#10B981]/20 flex items-center justify-center flex-shrink-0">
                  <ThumbsUp className="w-4 h-4 text-[#10B981]" strokeWidth={2.5} />
                </View>
                <div>
                  <Text className="text-[#2A0098]" style={{ fontWeight: 600 }}>{selectedRoom.bestSeats}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Avoid */}
          <View className="mb-6">
            <Text className="text-[#2A0098] mb-3" style={{ fontWeight: 700 }}>Seats to Avoid</Text>
            <View className="bg-[#F59E0B]/10 border border-[#F59E0B]/20 backdrop-blur-xl rounded-2xl p-4">
              <View className="flex items-start gap-3">
                <View className="w-8 h-8 rounded-full bg-[#F59E0B]/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4 text-[#F59E0B]" strokeWidth={2.5} />
                </View>
                <div>
                  <Text className="text-[#2A0098]" style={{ fontWeight: 600 }}>{selectedRoom.avoid}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Find Your Perfect Seat - Interactive Feature */}
          <View className="mb-6">
            <View className="bg-gradient-to-r from-[#FF85A2]/10 to-[#6B5CAC]/10 backdrop-blur-xl rounded-2xl p-5 border border-[#FF85A2]/30">
              <View className="flex items-center gap-2 mb-3">
                <Navigation className="w-5 h-5 text-[#FF85A2]" strokeWidth={2.5} />
                <Text className="text-[#2A0098]" style={{ fontWeight: 700 }}>Find Your Perfect Seat</Text>
              </View>
              <Text className="text-[#6B5CAC] text-sm mb-4">
                Answer a few quick questions and get personalized seat recommendations for this room
              </Text>
              <button
                onPress={() => {
                  setShowSeatFinder(true);
                  setQuizStep(0);
                  setQuizAnswers({ usesBSL: null, lipsReads: null, preference: null });
                  setCurrentCardIndex(0);
                }}
                className="w-full bg-[#FF85A2] text-white rounded-xl p-3 hover:bg-[#FF85A2]/90 transition-all flex items-center justify-center gap-2"
                style={{ fontWeight: 600 }}
              >
                <span>Start Quiz</Text>
                <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Top Tips */}
          <View className="mb-6">
            <Text className="text-[#2A0098] mb-3" style={{ fontWeight: 700 }}>Top Tips from Deaf Students</Text>
            <View className="space-y-3">
              {selectedRoom.topTips.map((tip, idx) => (
                <View key={idx} className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/80 shadow-sm">
                  <View className="flex items-start gap-3">
                    <View className="w-6 h-6 rounded-full bg-[#6B5CAC]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Lightbulb className="w-3.5 h-3.5 text-[#6B5CAC]" strokeWidth={2.5} />
                    </View>
                    <Text className="text-[#6B5CAC] text-sm">{tip}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Written Reviews */}
          <View className="mb-6">
            <button
              onPress={() => setShowReviews(!showReviews)}
              className="w-full flex items-center justify-between mb-3 bg-gradient-to-r from-[#FF85A2]/10 to-[#2A0098]/10 backdrop-blur-xl rounded-2xl p-4 border border-[#FF85A2]/30 focus:outline-none hover:from-[#FF85A2]/15 hover:to-[#2A0098]/15 transition-all"
              aria-label={showReviews ? "Hide reviews" : "Show reviews"}
            >
              <View className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-[#FF85A2] text-[#FF85A2]" strokeWidth={2} />
                <Text className="text-[#2A0098]" style={{ fontWeight: 700 }}>Written Reviews ({selectedRoom.reviews.length})</Text>
              </View>
              <ChevronRight
                className={`w-5 h-5 text-[#2A0098] transition-transform ${showReviews ? 'rotate-90' : ''}`}
                strokeWidth={2.5}
              />
            </TouchableOpacity>
            
            {/* AnimatePresence - replace with conditional render */
              {showReviews && (
                <Animated.View
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <View className="space-y-4 max-h-96 overflow-y-auto pr-1">
                    {selectedRoom.reviews.map((review) => (
                      <View key={review.id} className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/80 shadow-sm">
                        {/* Review Header */}
                        <View className="flex items-start justify-between gap-3 mb-3">
                          <View className="flex-1">
                            <View className="flex items-center gap-2 mb-1">
                              <Text className="text-[#2A0098]" style={{ fontWeight: 700 }}>{review.author}</Text>
                              {review.verified && (
                                <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" strokeWidth={2.5} />
                              )}
                              <Text className="px-2 py-0.5 bg-[#6B5CAC]/10 border border-[#6B5CAC]/20 rounded-lg text-[#6B5CAC] text-[10px]" style={{ fontWeight: 600 }}>
                                {review.authorType}
                              </Text>
                            </View>
                            <View className="flex items-center gap-2 text-[#6B5CAC] text-xs">
                              <Clock className="w-3 h-3" strokeWidth={2.5} />
                              <span>{review.date}</Text>
                            </View>
                          </View>
                          <View className="flex items-center gap-1.5 flex-shrink-0">
                            <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" strokeWidth={1.5} />
                            <Text className="text-[#2A0098]" style={{ fontWeight: 700 }}>{review.rating}</Text>
                          </View>
                        </View>

                        {/* Review Comment */}
                        <Text className="text-[#6B5CAC] text-sm leading-relaxed">{review.comment}</Text>
                      </View>
                    ))}
                  </View>
                </Animated.View>
              )}
            
          </View>

          {/* Add Review Button */}
          <View className="bg-[#FF85A2]/10 border-2 border-[#FF85A2]/30 backdrop-blur-xl rounded-2xl p-5">
            <View className="text-center mb-3">
              <Text className="text-[#2A0098] text-sm mb-1" style={{ fontWeight: 600 }}>
                Hey everyone! 👋
              </Text>
              <Text className="text-[#6B5CAC] text-sm">
                Please add your review to help improve accessibility around campus and facilitate equity for all Deaf students
              </Text>
            </View>
            <button
              onPress={() => setShowAddReview(true)}
              className="w-full bg-[#FF85A2] text-white rounded-xl p-3 hover:bg-[#FF85A2]/90 hover:shadow-lg transition-all"
              style={{ fontWeight: 700 }}
            >
              + Add Your Review
            </TouchableOpacity>
          </View>
        </View>

        {/* Add Review Modal */}
        {/* AnimatePresence - replace with conditional render */
          {showAddReview && (
            <>
              <Animated.View
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-[#2A0098]/40 backdrop-blur-sm z-40"
                onPress={() => setShowAddReview(false)}
              />
              <Animated.View
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-[#E8F4F8] rounded-3xl p-6 shadow-2xl z-50 max-h-[80vh] overflow-y-auto"
              >
                <View className="flex items-center justify-between mb-4">
                  <Text className="text-[#2A0098]" style={{ fontWeight: 700 }}>Add Review</Text>
                  <button
                    onPress={() => setShowAddReview(false)}
                    className="w-8 h-8 rounded-full bg-[#2A0098]/10 flex items-center justify-center hover:bg-[#2A0098]/20 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4 text-[#2A0098]" strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>

                <Text className="text-[#6B5CAC] text-sm mb-6">
                  Share your experience with {selectedRoom.name} to help other Deaf students
                </Text>

                {/* Student Type Selection */}
                <View className="mb-6">
                  <label className="text-[#2A0098] text-sm block mb-3" style={{ fontWeight: 600 }}>
                    I am a...
                  </label>
                  <View className="grid grid-cols-2 gap-3">
                    <button
                      onPress={() => setStudentType("Deaf Student")}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        studentType === "Deaf Student"
                          ? "bg-[#FF85A2] border-[#FF85A2] text-white"
                          : "bg-white/60 border-[#2A0098]/20 text-[#2A0098] hover:bg-white/80"
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      Deaf Student
                    </TouchableOpacity>
                    <button
                      onPress={() => setStudentType("HOH Student")}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        studentType === "HOH Student"
                          ? "bg-[#FF85A2] border-[#FF85A2] text-white"
                          : "bg-white/60 border-[#2A0098]/20 text-[#2A0098] hover:bg-white/80"
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      HOH Student
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Anonymous Toggle */}
                <View className="mb-6">
                  <button
                    onPress={() => setIsAnonymous(!isAnonymous)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/60 border border-[#2A0098]/20 hover:bg-white/80 transition-all"
                  >
                    <Text className="text-[#2A0098] text-sm" style={{ fontWeight: 600 }}>
                      Post anonymously
                    </Text>
                    <div
                      className={`w-12 h-6 rounded-full transition-all ${
                        isAnonymous ? "bg-[#10B981]" : "bg-[#2A0098]/20"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform m-0.5 ${
                          isAnonymous ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Rating Sliders */}
                <View className="space-y-5 mb-6">
                  {[
                    { label: "Visual Access", icon: Eye },
                    { label: "Acoustics", icon: Volume2 },
                    { label: "Lighting", icon: Sun },
                    { label: "Seating Flexibility", icon: Navigation },
                  ].map((metric) => {
                    const Icon = metric.icon;
                    return (
                      <View key={metric.label} className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-[#2A0098]/20">
                        <View className="flex items-center gap-2 mb-3">
                          <Icon className="w-4 h-4 text-[#2A0098]" strokeWidth={2.5} />
                          <Text className="text-[#2A0098] text-sm" style={{ fontWeight: 600 }}>{metric.label}</Text>
                          <button
                            onPress={(e) => {
                              e.stopPropagation();
                              setShowMetricInfo(metric.label);
                            }}
                            className="w-4 h-4 rounded-full bg-[#2A0098]/10 flex items-center justify-center hover:bg-[#2A0098]/20 transition-colors ml-auto"
                            aria-label={`Info about ${metric.label}`}
                          >
                            <Info className="w-3 h-3 text-[#2A0098]" strokeWidth={2.5} />
                          </TouchableOpacity>
                        </View>
                        
                        <View className="mb-2">
                          <style>{`
                            .slider::-webkit-slider-thumb {
                              appearance: none;
                              width: 20px;
                              height: 20px;
                              border-radius: 50%;
                              background: #B8D4F1;
                              cursor: pointer;
                              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                            }
                            .slider::-moz-range-thumb {
                              width: 20px;
                              height: 20px;
                              border-radius: 50%;
                              background: #B8D4F1;
                              cursor: pointer;
                              border: none;
                              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                            }
                          `}</style>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            defaultValue="50"
                            className="w-full h-2 bg-gradient-to-r from-[#EF4444] via-[#F59E0B] via-[#3B82F6] to-[#10B981] rounded-full appearance-none cursor-pointer slider"
                          />
                        </View>
                        
                        <View className="flex justify-between text-[10px] text-[#6B5CAC]" style={{ fontWeight: 600 }}>
                          <span>Bad</Text>
                          <span>Okay</Text>
                          <span>Good</Text>
                          <span>Excellent</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>

                {/* Comment Box */}
                <View className="mb-6">
                  <label className="text-[#2A0098] text-sm block mb-2" style={{ fontWeight: 600 }}>
                    Your Tips & Comments
                  </label>
                  <textarea
                    placeholder="Share specific seating recommendations, accessibility features, or tips..."
                    className="w-full h-32 px-4 py-3 bg-white/60 backdrop-blur-xl border border-[#2A0098]/20 rounded-2xl text-[#2A0098] placeholder-[#6B5CAC]/50 focus:outline-none focus:ring-2 focus:ring-[#FF85A2]/30 focus:border-[#FF85A2]/30 transition-all resize-none"
                  />
                </View>

                {/* Submit */}
                <button
                  onPress={handleAddReview}
                  className="w-full bg-gradient-to-r from-[#FF85A2] to-[#2A0098] text-white rounded-2xl p-4 hover:shadow-lg transition-all"
                  style={{ fontWeight: 700 }}
                >
                  Submit Review
                </TouchableOpacity>
              </Animated.View>
            </>
          )}
        

        {/* Metric Info Modal */}
        {/* AnimatePresence - replace with conditional render */
          {showMetricInfo && (
            <>
              <Animated.View
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-[#2A0098]/40 backdrop-blur-sm z-40"
                onPress={() => setShowMetricInfo(null)}
              />
              <Animated.View
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-[#FFFBF5] rounded-3xl p-6 shadow-2xl z-50 max-h-[80vh] overflow-y-auto"
              >
                <View className="flex items-center justify-between mb-4">
                  <Text className="text-[#2A0098]" style={{ fontWeight: 700 }}>Metric Info</Text>
                  <button
                    onPress={() => setShowMetricInfo(null)}
                    className="w-8 h-8 rounded-full bg-[#6B5CAC]/10 flex items-center justify-center hover:bg-[#6B5CAC]/20 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4 text-[#2A0098]" strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>

                <Text className="text-[#6B5CAC] text-sm mb-4">
                  {metricExplanations[showMetricInfo]}
                </Text>
              </Animated.View>
            </>
          )}
        

        {/* Find Your Perfect Seat - Quiz & Cards Modal */}
        {/* AnimatePresence - replace with conditional render */
          {showSeatFinder && (
            <>
              <Animated.View
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-[#2A0098]/40 backdrop-blur-sm z-40"
                onPress={() => setShowSeatFinder(false)}
              />
              <Animated.View
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-gradient-to-br from-[#FFFBF5] to-[#FFE8F0] rounded-3xl p-6 shadow-2xl z-50 max-h-[85vh] overflow-y-auto"
              >
                {/* Close Button */}
                <button
                  onPress={() => setShowSeatFinder(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/60 backdrop-blur-xl flex items-center justify-center hover:bg-white/80 transition-colors z-10"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-[#2A0098]" strokeWidth={2.5} />
                </TouchableOpacity>

                {/* Quiz Flow */}
                {quizStep < 3 && (
                  <div>
                    {/* Progress Indicator */}
                    <View className="flex items-center gap-2 mb-6">
                      {[0, 1, 2].map((step) => (
                        <div
                          key={step}
                          className={`flex-1 h-1.5 rounded-full transition-all ${
                            step <= quizStep ? "bg-[#FF85A2]" : "bg-[#2A0098]/10"
                          }`}
                        />
                      ))}
                    </View>

                    {/* Question 1: BSL */}
                    {quizStep === 0 && (
                      <Animated.View
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <View className="text-center mb-8">
                          <View className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF85A2] to-[#6B5CAC] flex items-center justify-center mx-auto mb-4">
                            <Text className="text-3xl">🤟</Text>
                          </View>
                          <Text className="text-[#2A0098] mb-2" style={{ fontWeight: 700 }}>
                            Do you use BSL?
                          </Text>
                          <Text className="text-[#6B5CAC] text-sm">
                            This helps us recommend seats with good sightlines to the interpreter
                          </Text>
                        </View>

                        <View className="grid grid-cols-2 gap-3">
                          <button
                            onPress={() => {
                              setQuizAnswers({ ...quizAnswers, usesBSL: true });
                              setQuizStep(1);
                            }}
                            className="p-6 rounded-2xl bg-white/60 backdrop-blur-xl border-2 border-[#FF85A2]/30 hover:bg-[#FF85A2] hover:text-white hover:border-[#FF85A2] transition-all group"
                            style={{ fontWeight: 600 }}
                          >
                            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-[#10B981] group-hover:text-white" strokeWidth={2.5} />
                            <Text className="text-[#2A0098] group-hover:text-white">Yes</Text>
                          </TouchableOpacity>
                          <button
                            onPress={() => {
                              setQuizAnswers({ ...quizAnswers, usesBSL: false });
                              setQuizStep(1);
                            }}
                            className="p-6 rounded-2xl bg-white/60 backdrop-blur-xl border-2 border-[#6B5CAC]/30 hover:bg-[#6B5CAC] hover:text-white hover:border-[#6B5CAC] transition-all group"
                            style={{ fontWeight: 600 }}
                          >
                            <X className="w-8 h-8 mx-auto mb-2 text-[#6B5CAC] group-hover:text-white" strokeWidth={2.5} />
                            <Text className="text-[#2A0098] group-hover:text-white">No</Text>
                          </TouchableOpacity>
                        </View>
                      </Animated.View>
                    )}

                    {/* Question 2: Lip Reading */}
                    {quizStep === 1 && (
                      <Animated.View
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <View className="text-center mb-8">
                          <View className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF85A2] to-[#6B5CAC] flex items-center justify-center mx-auto mb-4">
                            <Text className="text-3xl">👁️</Text>
                          </View>
                          <Text className="text-[#2A0098] mb-2" style={{ fontWeight: 700 }}>
                            Do you lip-read?
                          </Text>
                          <Text className="text-[#6B5CAC] text-sm">
                            This helps us recommend seats at the optimal distance from the lecturer
                          </Text>
                        </View>

                        <View className="grid grid-cols-2 gap-3 mb-4">
                          <button
                            onPress={() => {
                              setQuizAnswers({ ...quizAnswers, lipsReads: true });
                              setQuizStep(2);
                            }}
                            className="p-6 rounded-2xl bg-white/60 backdrop-blur-xl border-2 border-[#FF85A2]/30 hover:bg-[#FF85A2] hover:text-white hover:border-[#FF85A2] transition-all group"
                            style={{ fontWeight: 600 }}
                          >
                            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-[#10B981] group-hover:text-white" strokeWidth={2.5} />
                            <Text className="text-[#2A0098] group-hover:text-white">Yes</Text>
                          </TouchableOpacity>
                          <button
                            onPress={() => {
                              setQuizAnswers({ ...quizAnswers, lipsReads: false });
                              setQuizStep(2);
                            }}
                            className="p-6 rounded-2xl bg-white/60 backdrop-blur-xl border-2 border-[#6B5CAC]/30 hover:bg-[#6B5CAC] hover:text-white hover:border-[#6B5CAC] transition-all group"
                            style={{ fontWeight: 600 }}
                          >
                            <X className="w-8 h-8 mx-auto mb-2 text-[#6B5CAC] group-hover:text-white" strokeWidth={2.5} />
                            <Text className="text-[#2A0098] group-hover:text-white">No</Text>
                          </TouchableOpacity>
                        </View>

                        <button
                          onPress={() => setQuizStep(0)}
                          className="w-full text-[#6B5CAC] text-sm hover:text-[#2A0098] transition-colors"
                          style={{ fontWeight: 600 }}
                        >
                          ← Back
                        </TouchableOpacity>
                      </Animated.View>
                    )}

                    {/* Question 3: Preference */}
                    {quizStep === 2 && (
                      <Animated.View
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <View className="text-center mb-8">
                          <View className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF85A2] to-[#6B5CAC] flex items-center justify-center mx-auto mb-4">
                            <Text className="text-3xl">📍</Text>
                          </View>
                          <Text className="text-[#2A0098] mb-2" style={{ fontWeight: 700 }}>
                            Where do you prefer to sit?
                          </Text>
                          <Text className="text-[#6B5CAC] text-sm">
                            We'll prioritize zones based on your general preference
                          </Text>
                        </View>

                        <View className="space-y-3 mb-4">
                          <button
                            onPress={() => {
                              setQuizAnswers({ ...quizAnswers, preference: "front" });
                              setQuizStep(3);
                            }}
                            className="w-full p-5 rounded-2xl bg-white/60 backdrop-blur-xl border-2 border-[#FF85A2]/30 hover:bg-[#FF85A2] hover:text-white hover:border-[#FF85A2] transition-all text-left group"
                          >
                            <View className="flex items-center gap-3">
                              <View className="w-10 h-10 rounded-full bg-[#10B981]/10 group-hover:bg-white/20 flex items-center justify-center">
                                <Text className="text-xl">👀</Text>
                              </View>
                              <div>
                                <Text className="text-[#2A0098] group-hover:text-white" style={{ fontWeight: 600 }}>Front</Text>
                                <Text className="text-[#6B5CAC] group-hover:text-white/80 text-xs">Close to the action</Text>
                              </View>
                            </View>
                          </TouchableOpacity>

                          <button
                            onPress={() => {
                              setQuizAnswers({ ...quizAnswers, preference: "middle" });
                              setQuizStep(3);
                            }}
                            className="w-full p-5 rounded-2xl bg-white/60 backdrop-blur-xl border-2 border-[#3B82F6]/30 hover:bg-[#3B82F6] hover:text-white hover:border-[#3B82F6] transition-all text-left group"
                          >
                            <View className="flex items-center gap-3">
                              <View className="w-10 h-10 rounded-full bg-[#3B82F6]/10 group-hover:bg-white/20 flex items-center justify-center">
                                <Text className="text-xl">⚖️</Text>
                              </View>
                              <div>
                                <Text className="text-[#2A0098] group-hover:text-white" style={{ fontWeight: 600 }}>Middle</Text>
                                <Text className="text-[#6B5CAC] group-hover:text-white/80 text-xs">Balanced view</Text>
                              </View>
                            </View>
                          </TouchableOpacity>

                          <button
                            onPress={() => {
                              setQuizAnswers({ ...quizAnswers, preference: "back" });
                              setQuizStep(3);
                            }}
                            className="w-full p-5 rounded-2xl bg-white/60 backdrop-blur-xl border-2 border-[#6B5CAC]/30 hover:bg-[#6B5CAC] hover:text-white hover:border-[#6B5CAC] transition-all text-left group"
                          >
                            <View className="flex items-center gap-3">
                              <View className="w-10 h-10 rounded-full bg-[#6B5CAC]/10 group-hover:bg-white/20 flex items-center justify-center">
                                <Text className="text-xl">🚪</Text>
                              </View>
                              <div>
                                <Text className="text-[#2A0098] group-hover:text-white" style={{ fontWeight: 600 }}>Back</Text>
                                <Text className="text-[#6B5CAC] group-hover:text-white/80 text-xs">More space & overview</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>

                        <button
                          onPress={() => setQuizStep(1)}
                          className="w-full text-[#6B5CAC] text-sm hover:text-[#2A0098] transition-colors"
                          style={{ fontWeight: 600 }}
                        >
                          ← Back
                        </TouchableOpacity>
                      </Animated.View>
                    )}
                  </View>
                )}

                {/* Swipeable Seat Cards */}
                {quizStep === 3 && (() => {
                  // Generate personalized seat zones based on quiz answers
                  const seatZones = [];

                  // Front Row Center - Best for BSL + Lip Reading
                  if (quizAnswers.usesBSL || quizAnswers.lipsReads || quizAnswers.preference === "front") {
                    seatZones.push({
                      name: "Front Row Center",
                      emoji: "⭐",
                      rating: quizAnswers.usesBSL && quizAnswers.lipsReads ? 10 : 9,
                      ratingLabel: "Perfect Match",
                      color: "#10B981",
                      pros: [
                        quizAnswers.usesBSL && "Clear sightline to BSL interpreter",
                        quizAnswers.lipsReads && "Optimal distance for lip reading (2-3m)",
                        "Best visual access to screen and lecturer",
                        "Prime spot for captions if available"
                      ].filter(Boolean),
                      cons: [
                        "Can be competitive - arrive 10 mins early",
                        "Less overview of other students"
                      ],
                      seats: "Rows A-B, Seats 3-8 (central)",
                      tip: "Seats A4-A6 are the sweet spot!"
                    });
                  }

                  // Front Side (Interpreter Zone)
                  if (quizAnswers.usesBSL) {
                    seatZones.push({
                      name: "Front Side (Interpreter Zone)",
                      emoji: "🤟",
                      rating: 9,
                      ratingLabel: "Excellent for BSL",
                      color: "#FF85A2",
                      pros: [
                        "Closest to interpreter position",
                        "Clear BSL visibility",
                        "Easy to switch between lecturer and interpreter"
                      ],
                      cons: [
                        "Angled view of screen",
                        quizAnswers.lipsReads && "Slightly harder for lip reading lecturer"
                      ].filter(Boolean),
                      seats: "Row A-B, Right side seats 1-3",
                      tip: "Ask where the interpreter will stand - usually stage right"
                    });
                  }

                  // Middle Section - Balanced
                  if (quizAnswers.preference === "middle" || (!quizAnswers.usesBSL && !quizAnswers.lipsReads)) {
                    seatZones.push({
                      name: "Middle Section",
                      emoji: "⚖️",
                      rating: 7,
                      ratingLabel: "Good Balance",
                      color: "#3B82F6",
                      pros: [
                        "Good overall view of room",
                        "Can see other students easily",
                        "Less pressure than front row",
                        "Reasonable visual access"
                      ],
                      cons: [
                        quizAnswers.lipsReads && "Further from lecturer for lip reading",
                        quizAnswers.usesBSL && "Interpreter may be smaller/harder to see",
                        "Captions can be harder to read"
                      ].filter(Boolean),
                      seats: `Row ${selectedRoom.capacity > 100 ? "C-D" : "B-C"}, Central seats`,
                      tip: "Great compromise if front rows are full"
                    });
                  }

                  // Window Seats - Lighting considerations
                  seatZones.push({
                    name: "Window Seats",
                    emoji: "☀️",
                    rating: 6,
                    ratingLabel: "Depends on Time",
                    color: "#F59E0B",
                    pros: [
                      "Natural lighting helps with lip reading",
                      "Pleasant atmosphere",
                      "Good in afternoon sessions"
                    ],
                    cons: [
                      "Morning glare on screens",
                      "Backlighting can make lecturer harder to see",
                      "BSL interpreter may be backlit"
                    ],
                    seats: "Window-side rows",
                    tip: "Best for afternoon lectures when sun is behind the building"
                  });

                  // Aisle Seats - Flexibility
                  seatZones.push({
                    name: "Aisle Seats",
                    emoji: "🚶",
                    rating: 7,
                    ratingLabel: "Good Flexibility",
                    color: "#6B5CAC",
                    pros: [
                      "Easy entry/exit",
                      "More leg room",
                      "Can adjust position easily",
                      "Good if you need to leave early"
                    ],
                    cons: [
                      "People walking past can be distracting",
                      "Slightly angled view"
                    ],
                    seats: "Any row, aisle seats",
                    tip: "Combine with front/middle rows for best results"
                  });

                  // Back Rows - Usually avoid
                  if (quizAnswers.preference === "back") {
                    seatZones.push({
                      name: "Back Rows",
                      emoji: "🔴",
                      rating: 3,
                      ratingLabel: "Not Recommended",
                      color: "#EF4444",
                      pros: [
                        "Overview of entire room",
                        "Easy exit",
                        "More privacy"
                      ],
                      cons: [
                        quizAnswers.usesBSL && "Interpreter too far to see clearly",
                        quizAnswers.lipsReads && "Way too far for lip reading",
                        "Poor visual access to screen",
                        "Captions very hard to read",
                        "Often poor acoustics"
                      ].filter(Boolean),
                      seats: "Last 2 rows",
                      tip: "Only if you have no other choice - front is much better!"
                    });
                  } else {
                    seatZones.push({
                      name: "Back Rows",
                      emoji: "❌",
                      rating: 2,
                      ratingLabel: "Avoid",
                      color: "#EF4444",
                      pros: [
                        "Easy exit if needed"
                      ],
                      cons: [
                        quizAnswers.usesBSL && "Interpreter too small to see",
                        quizAnswers.lipsReads && "Impossible for lip reading",
                        "Very poor visual access",
                        "Captions unreadable",
                        "Terrible acoustics",
                        "Not suitable for Deaf students"
                      ].filter(Boolean),
                      seats: "Last 2 rows",
                      tip: "Seriously, avoid these seats! Front is SO much better 😊"
                    });
                  }

                  return (
                    <Animated.View
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <View className="text-center mb-6">
                        <View className="w-16 h-16 rounded-full bg-gradient-to-br from-[#10B981] to-[#3B82F6] flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={2.5} />
                        </View>
                        <Text className="text-[#2A0098] mb-2" style={{ fontWeight: 700 }}>
                          Your Perfect Seats
                        </Text>
                        <Text className="text-[#6B5CAC] text-sm">
                          Swipe through personalized recommendations for {selectedRoom.name}
                        </Text>
                      </View>

                      {/* Swipe Card */}
                      <View className="relative mb-4">
                        <AnimatePresence mode="wait">
                          <Animated.View
                            key={currentCardIndex}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 shadow-lg"
                            style={{ borderColor: seatZones[currentCardIndex].color }}
                          >
                            {/* Card Header */}
                            <View className="text-center mb-5">
                              <View className="text-5xl mb-3">{seatZones[currentCardIndex].emoji}</View>
                              <Text className="text-[#2A0098] mb-2" style={{ fontWeight: 700 }}>
                                {seatZones[currentCardIndex].name}
                              </Text>
                              <View className="flex items-center justify-center gap-2">
                                <div
                                  className="px-3 py-1 rounded-full text-white text-sm"
                                  style={{ backgroundColor: seatZones[currentCardIndex].color, fontWeight: 600 }}
                                >
                                  {seatZones[currentCardIndex].rating}/10
                                </View>
                                <Text className="text-[#6B5CAC] text-sm" style={{ fontWeight: 600 }}>
                                  {seatZones[currentCardIndex].ratingLabel}
                                </Text>
                              </View>
                            </View>

                            {/* Pros */}
                            <View className="mb-4">
                              <View className="flex items-center gap-2 mb-2">
                                <ThumbsUp className="w-4 h-4 text-[#10B981]" strokeWidth={2.5} />
                                <Text className="text-[#2A0098] text-sm" style={{ fontWeight: 700 }}>Pros</Text>
                              </View>
                              <ul className="space-y-1.5">
                                {seatZones[currentCardIndex].pros.map((pro, idx) => (
                                  <li key={idx} className="text-[#6B5CAC] text-sm flex items-start gap-2">
                                    <Text className="text-[#10B981] flex-shrink-0">•</Text>
                                    <span>{pro}</Text>
                                  </li>
                                ))}
                              </ul>
                            </View>

                            {/* Cons */}
                            <View className="mb-4">
                              <View className="flex items-center gap-2 mb-2">
                                <AlertCircle className="w-4 h-4 text-[#F59E0B]" strokeWidth={2.5} />
                                <Text className="text-[#2A0098] text-sm" style={{ fontWeight: 700 }}>Cons</Text>
                              </View>
                              <ul className="space-y-1.5">
                                {seatZones[currentCardIndex].cons.map((con, idx) => (
                                  <li key={idx} className="text-[#6B5CAC] text-sm flex items-start gap-2">
                                    <Text className="text-[#F59E0B] flex-shrink-0">•</Text>
                                    <span>{con}</Text>
                                  </li>
                                ))}
                              </ul>
                            </View>

                            {/* Recommended Seats */}
                            <View className="bg-gradient-to-r from-[#FF85A2]/10 to-[#6B5CAC]/10 rounded-2xl p-4 mb-4">
                              <View className="flex items-center gap-2 mb-2">
                                <Navigation className="w-4 h-4 text-[#FF85A2]" strokeWidth={2.5} />
                                <Text className="text-[#2A0098] text-sm" style={{ fontWeight: 700 }}>Recommended Seats</Text>
                              </View>
                              <Text className="text-[#2A0098]" style={{ fontWeight: 600 }}>
                                {seatZones[currentCardIndex].seats}
                              </Text>
                            </View>

                            {/* Tip */}
                            <View className="bg-[#FFE8F0] rounded-2xl p-4">
                              <View className="flex items-start gap-3">
                                <Lightbulb className="w-5 h-5 text-[#FF85A2] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                                <div>
                                  <Text className="text-[#2A0098] text-sm" style={{ fontWeight: 700 }}>Pro Tip: </Text>
                                  <Text className="text-[#6B5CAC] text-sm">{seatZones[currentCardIndex].tip}</Text>
                                </View>
                              </View>
                            </View>
                          </Animated.View>
                        
                      </View>

                      {/* Navigation */}
                      <View className="flex items-center justify-between mb-4">
                        <button
                          onPress={() => setCurrentCardIndex(Math.max(0, currentCardIndex - 1))}
                          disabled={currentCardIndex === 0}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                            currentCardIndex === 0
                              ? "text-[#6B5CAC]/30 cursor-not-allowed"
                              : "text-[#FF85A2] hover:bg-[#FF85A2]/10"
                          }`}
                          style={{ fontWeight: 600 }}
                        >
                          <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
                          <span>Previous</Text>
                        </TouchableOpacity>

                        {/* Dots Indicator */}
                        <View className="flex items-center gap-2">
                          {seatZones.map((_, idx) => (
                            <button
                              key={idx}
                              onPress={() => setCurrentCardIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                idx === currentCardIndex ? "bg-[#FF85A2] w-6" : "bg-[#2A0098]/20"
                              }`}
                              aria-label={`Go to card ${idx + 1}`}
                            />
                          ))}
                        </View>

                        <button
                          onPress={() => setCurrentCardIndex(Math.min(seatZones.length - 1, currentCardIndex + 1))}
                          disabled={currentCardIndex === seatZones.length - 1}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                            currentCardIndex === seatZones.length - 1
                              ? "text-[#6B5CAC]/30 cursor-not-allowed"
                              : "text-[#FF85A2] hover:bg-[#FF85A2]/10"
                          }`}
                          style={{ fontWeight: 600 }}
                        >
                          <span>Next</Text>
                          <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                        </TouchableOpacity>
                      </View>

                      {/* Card Counter */}
                      <Text className="text-center text-[#6B5CAC] text-sm mb-4">
                        Card {currentCardIndex + 1} of {seatZones.length}
                      </Text>

                      {/* Done Button */}
                      <button
                        onPress={() => {
                          setShowSeatFinder(false);
                          toast.success("Seat recommendations saved!", {
                            description: "Check the top zones when picking your seat"
                          });
                        }}
                        className="w-full bg-gradient-to-r from-[#FF85A2] to-[#2A0098] text-white rounded-2xl p-4 hover:shadow-lg transition-all"
                        style={{ fontWeight: 700 }}
                      >
                        Done
                      </TouchableOpacity>

                      {/* Retake Quiz */}
                      <button
                        onPress={() => {
                          setQuizStep(0);
                          setQuizAnswers({ usesBSL: null, lipsReads: null, preference: null });
                          setCurrentCardIndex(0);
                        }}
                        className="w-full text-[#6B5CAC] text-sm mt-3 hover:text-[#2A0098] transition-colors"
                        style={{ fontWeight: 600 }}
                      >
                        ← Retake Quiz
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })()}
              </Animated.View>
            </>
          )}
        
      </View>
    );
  }

  // Top rated rooms for featured section
  const topRatedRooms = [...rooms].sort((a, b) => b.overallRating - a.overallRating).slice(0, 5);
  const bslReadyRooms = rooms.filter(r => r.bslInterpreterSpace && r.captionDisplay);
  
  // Sort rooms based on selected option
  const getSortedRooms = () => {
    const sorted = [...filteredRooms];
    if (sortBy === "rating") {
      return sorted.sort((a, b) => b.overallRating - a.overallRating);
    } else if (sortBy === "bsl") {
      return sorted.sort((a, b) => {
        const aBsl = (a.bslInterpreterSpace && a.captionDisplay) ? 1 : 0;
        const bBsl = (b.bslInterpreterSpace && b.captionDisplay) ? 1 : 0;
        return bBsl - aBsl;
      });
    } else {
      return sorted; // "recent" - keep original order
    }
  };
  
  const displayedRooms = getSortedRooms();

  return (
    <View className="h-full flex flex-col bg-[#FFFBF5]">
      {/* Header */}
      <View className="px-6 pt-6 pb-4 border-b border-[#6B5CAC]/10">
        <View className="flex items-center justify-between">
          <View className="flex items-center gap-3">
            <View className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#34D399] shadow-md flex items-center justify-center">
              <Map className="w-6 h-6 text-white" strokeWidth={2.5} />
            </View>
            <div>
              <Text className="text-2xl text-[#2A0098]">Sensory Scout</Text>
              <Text className="text-[#6B5CAC] text-sm">Space reviews for confident choices</Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => setShowInfoDialog(true)}
            className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-xl border border-white/80 flex items-center justify-center hover:bg-white/80 transition-all"
          >
            <Info className="w-4 h-4 text-[#6B5CAC]" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <View className="flex-1 overflow-y-auto">
        {/* Search Bar & Sort */}
        <View className="px-6 py-4">
          <View className="flex gap-2">
            <View className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B5CAC]" strokeWidth={2} />
              <input
                type="text"
                placeholder="Search rooms and buildings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl text-[#2A0098] placeholder-[#6B5CAC]/50 focus:outline-none focus:ring-2 focus:ring-[#FF85A2]/30 focus:border-[#FF85A2] transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onPress={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FF85A2] hover:bg-[#FF85A2]/90 flex items-center justify-center transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                </TouchableOpacity>
              )}
            </View>
            
            {/* Sort Dropdown */}
            <View className="relative">
              <button
                onPress={() => setShowSortMenu(!showSortMenu)}
                className="h-full px-4 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl flex items-center gap-2 hover:bg-white/70 transition-all shadow-sm"
              >
                <Filter className="w-4 h-4 text-[#6B5CAC]" strokeWidth={2} />
                <Text className="text-[#2A0098] text-sm" style={{ fontWeight: 600 }}>
                  {sortBy === "rating" ? "Top Rated" : sortBy === "bsl" ? "BSL Ready" : "Recent"}
                </Text>
                <ChevronDown className={`w-4 h-4 text-[#6B5CAC] transition-transform ${showSortMenu ? 'rotate-180' : ''}`} strokeWidth={2} />
              </TouchableOpacity>
              
              {/* Dropdown Menu */}
              {/* AnimatePresence - replace with conditional render */
                {showSortMenu && (
                  <Animated.View
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-xl border border-white/80 rounded-2xl shadow-lg overflow-hidden z-20"
                  >
                    <button
                      onPress={() => { setSortBy("rating"); setShowSortMenu(false); }}
                      className={`w-full px-4 py-3 text-left flex items-center gap-2 hover:bg-[#FF85A2]/10 transition-colors ${sortBy === "rating" ? "bg-[#FF85A2]/10" : ""}`}
                    >
                      <Star className={`w-4 h-4 ${sortBy === "rating" ? "text-[#F59E0B] fill-[#F59E0B]" : "text-[#6B5CAC]"}`} strokeWidth={2} />
                      <Text className={`text-sm ${sortBy === "rating" ? "text-[#2A0098]" : "text-[#6B5CAC]"}`} style={{ fontWeight: sortBy === "rating" ? 600 : 400 }}>Top Rated</Text>
                    </TouchableOpacity>
                    <button
                      onPress={() => { setSortBy("bsl"); setShowSortMenu(false); }}
                      className={`w-full px-4 py-3 text-left flex items-center gap-2 hover:bg-[#FF85A2]/10 transition-colors ${sortBy === "bsl" ? "bg-[#FF85A2]/10" : ""}`}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${sortBy === "bsl" ? "text-[#6B5CAC]" : "text-[#6B5CAC]"}`} strokeWidth={2} />
                      <Text className={`text-sm ${sortBy === "bsl" ? "text-[#2A0098]" : "text-[#6B5CAC]"}`} style={{ fontWeight: sortBy === "bsl" ? 600 : 400 }}>BSL Ready First</Text>
                    </TouchableOpacity>
                    <button
                      onPress={() => { setSortBy("recent"); setShowSortMenu(false); }}
                      className={`w-full px-4 py-3 text-left flex items-center gap-2 hover:bg-[#FF85A2]/10 transition-colors ${sortBy === "recent" ? "bg-[#FF85A2]/10" : ""}`}
                    >
                      <Clock className={`w-4 h-4 ${sortBy === "recent" ? "text-[#6B5CAC]" : "text-[#6B5CAC]"}`} strokeWidth={2} />
                      <Text className={`text-sm ${sortBy === "recent" ? "text-[#2A0098]" : "text-[#6B5CAC]"}`} style={{ fontWeight: sortBy === "recent" ? 600 : 400 }}>Recently Updated</Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}
              
            </View>
          </View>
        </View>

        {!searchQuery && (
          <>
            {/* Featured Top Rated - Horizontal Scroll */}
            <View className="mb-5">
              <View className="px-6 mb-3">
                <Text className="text-[#2A0098]" style={{ fontWeight: 700 }}>Top Rated</Text>
              </View>
              <View className="overflow-x-auto scrollbar-hide px-6">
                <View className="flex gap-3 pb-2">
                  {topRatedRooms.slice(0, 5).map((room, index) => (
                    <button
                      key={room.id}
                      onPress={() => setSelectedRoom(room)}
                      className="flex-shrink-0 w-56 bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/80 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all text-left"
                    >
                      {/* Rank & Rating */}
                      <View className="flex items-center justify-between mb-3">
                        <View className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${
                          index === 0 
                            ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706]' 
                            : index === 1
                            ? 'bg-gradient-to-r from-[#FF85A2] to-[#FF6B8A]'
                            : 'bg-[#6B5CAC]/10'
                        }`}>
                          <Text className={`text-xs ${index <= 1 ? 'text-white' : 'text-[#6B5CAC]'}`} style={{ fontWeight: 700 }}>#{index + 1}</Text>
                        </View>
                        <View className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" strokeWidth={1.5} />
                          <Text className="text-[#2A0098] text-sm" style={{ fontWeight: 700 }}>{room.overallRating}</Text>
                        </View>
                      </View>
                      
                      {/* Room Info */}
                      <Text className="text-[#2A0098] mb-1 text-sm">{room.name}</Text>
                      <Text className="text-[#6B5CAC] text-xs mb-3">{room.building}</Text>
                      
                      {/* Quick Stats */}
                      <View className="flex items-center gap-2">
                        {room.bslInterpreterSpace && (
                          <View className="px-2 py-1 bg-[#6B5CAC]/10 rounded-lg">
                            <Text className="text-[#6B5CAC] text-xs" style={{ fontWeight: 600 }}>BSL</Text>
                          </View>
                        )}
                        {room.captionDisplay && (
                          <View className="px-2 py-1 bg-[#FF85A2]/10 rounded-lg">
                            <Text className="text-[#FF85A2] text-xs" style={{ fontWeight: 600 }}>CC</Text>
                          </View>
                        )}
                        <Text className="text-[#6B5CAC] text-xs ml-auto">{room.reviewCount} reviews</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* BSL Ready - Horizontal Scroll */}
            {bslReadyRooms.length > 0 && (
              <View className="mb-5">
                <View className="px-6 mb-3 flex items-center justify-between">
                  <Text className="text-[#2A0098]" style={{ fontWeight: 700 }}>BSL Ready</Text>
                  <Text className="text-[#6B5CAC] text-xs px-2 py-1 bg-[#6B5CAC]/10 rounded-lg" style={{ fontWeight: 600 }}>
                    {bslReadyRooms.length} spaces
                  </Text>
                </View>
                <View className="overflow-x-auto scrollbar-hide px-6">
                  <View className="flex gap-3 pb-2">
                    {bslReadyRooms.slice(0, 4).map((room) => (
                      <button
                        key={room.id}
                        onPress={() => setSelectedRoom(room)}
                        className="flex-shrink-0 w-48 bg-gradient-to-br from-[#6B5CAC]/10 to-[#FF85A2]/10 backdrop-blur-xl rounded-2xl p-4 border border-[#6B5CAC]/30 hover:border-[#FF85A2]/40 hover:scale-[1.02] transition-all text-left shadow-sm"
                      >
                        <View className="flex items-center justify-between mb-2">
                          <View className="w-7 h-7 rounded-lg bg-[#6B5CAC]/20 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-[#6B5CAC]" strokeWidth={2.5} />
                          </View>
                          <View className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" strokeWidth={1.5} />
                            <Text className="text-[#2A0098] text-xs" style={{ fontWeight: 700 }}>{room.overallRating}</Text>
                          </View>
                        </View>
                        <Text className="text-[#2A0098] text-sm mb-0.5">{room.name}</Text>
                        <Text className="text-[#6B5CAC] text-xs">{room.building}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {/* All Spaces Section */}
            <View className="px-6 pt-2 pb-3 border-t border-[#6B5CAC]/10">
              <Text className="text-[#2A0098] mb-3" style={{ fontWeight: 700 }}>All Spaces</Text>
            </View>
          </>
        )}

        {/* Room List */}
        <View className="px-6 pb-6">
          {displayedRooms.length === 0 ? (
          <View className="text-center py-12">
            <MapPin className="w-12 h-12 text-[#6B5CAC]/30 mx-auto mb-3" strokeWidth={2} />
            <Text className="text-[#2A0098] mb-1" style={{ fontWeight: 600 }}>No rooms found</Text>
            <Text className="text-[#6B5CAC] text-sm">Try searching for something else</Text>
          </View>
        ) : (
          <View className="space-y-3">
            {displayedRooms.map((room) => (
              <button
                key={room.id}
                onPress={() => setSelectedRoom(room)}
                className="w-full bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/80 shadow-sm hover:shadow-md hover:bg-white/70 transition-all text-left focus:outline-none focus:ring-2 focus:ring-[#FF85A2]/30 focus:ring-offset-2"
                aria-label={`View accessibility details for ${room.name}`}
              >
                {/* Compact Header */}
                <View className="flex items-start justify-between gap-3 mb-3">
                  <View className="flex-1 min-w-0">
                    <Text className="text-[#2A0098] mb-1">{room.name}</Text>
                    <Text className="text-[#6B5CAC] text-xs">{room.building}</Text>
                  </View>
                  <View className="flex items-center gap-1.5 flex-shrink-0">
                    <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" strokeWidth={1.5} />
                    <Text className="text-[#2A0098]" style={{ fontWeight: 700 }}>{room.overallRating}</Text>
                  </View>
                </View>

                {/* Compact Metrics - Simple bars */}
                <View className="space-y-2.5">
                  {[
                    { label: "Visual", value: room.visualAccess },
                    { label: "Acoustics", value: room.acoustics },
                    { label: "Lighting", value: room.lighting },
                  ].map((metric) => {
                    const ratingInfo = getRatingInfo(metric.value);
                    return (
                      <View key={metric.label} className="flex items-center gap-3">
                        <Text className="text-[#6B5CAC] text-xs w-16 flex-shrink-0" style={{ fontWeight: 600 }}>
                          {metric.label}
                        </Text>
                        <View className="flex-1 h-1.5 bg-[#2A0098]/10 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${metric.value}%`, background: ratingInfo.color }}
                          />
                        </View>
                        <View className="flex items-center gap-1.5 w-20 justify-end">
                          <Text className="text-xs" style={{ color: ratingInfo.color, fontWeight: 600 }}>
                            {ratingInfo.label}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>

                {/* View More Arrow */}
                <View className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-[#2A0098]/10">
                  <Text className="text-[#FF85A2] text-xs" style={{ fontWeight: 600 }}>View full details</Text>
                  <ChevronRight className="w-4 h-4 text-[#FF85A2]" strokeWidth={2.5} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        </View>
      </View>

      {/* Info Dialog */}
      {/* AnimatePresence - replace with conditional render */
        {showInfoDialog && (
          <>
            {/* Backdrop */}
            <Animated.View
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onPress={() => setShowInfoDialog(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            
            {/* Dialog */}
            <Animated.View
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg max-h-[80vh] bg-white/95 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <View className="px-6 py-5 border-b border-[#6B5CAC]/10 bg-gradient-to-br from-[#10B981]/10 to-[#34D399]/10">
                <View className="flex items-center justify-between">
                  <View className="flex items-center gap-3">
                    <View className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10B981] to-[#34D399] shadow-md flex items-center justify-center">
                      <Map className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </View>
                    <Text className="text-xl text-[#2A0098]" style={{ fontWeight: 700 }}>About Sensory Scout</Text>
                  </View>
                  <button
                    onPress={() => setShowInfoDialog(false)}
                    className="w-8 h-8 rounded-full bg-white/60 hover:bg-white/80 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-[#6B5CAC]" strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Content */}
              <View className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
                <View className="space-y-6">
                  {/* What is Sensory Scout */}
                  <View className="space-y-2">
                    <View className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-[#FF85A2]" strokeWidth={2} />
                      <Text className="text-lg text-[#2A0098]" style={{ fontWeight: 600 }}>What is Sensory Scout?</Text>
                    </View>
                    <Text className="text-[#6B5CAC] leading-relaxed">
                      Sensory Scout is a community-powered hub where Deaf and hard-of-hearing students share honest reviews about university spaces. Find out which lecture theatres have the best visual access, where BSL interpreters can be positioned, and which seats give you the clearest view.
                    </Text>
                  </View>

                  {/* How to Use Room Reviews */}
                  <View className="space-y-2">
                    <View className="flex items-center gap-2">
                      <Search className="w-5 h-5 text-[#10B981]" strokeWidth={2} />
                      <Text className="text-lg text-[#2A0098]" style={{ fontWeight: 600 }}>How to Use Room Reviews</Text>
                    </View>
                    <ul className="space-y-2 text-[#6B5CAC] leading-relaxed">
                      <li className="flex items-start gap-2">
                        <Text className="text-[#FF85A2] mt-1">•</Text>
                        <span><strong>Search for rooms</strong> by name or building to quickly find the spaces you need</Text>
                      </li>
                      <li className="flex items-start gap-2">
                        <Text className="text-[#FF85A2] mt-1">•</Text>
                        <span><strong>Check metrics</strong> like Visual Access, Acoustics, Lighting, and Seating Flexibility</Text>
                      </li>
                      <li className="flex items-start gap-2">
                        <Text className="text-[#FF85A2] mt-1">•</Text>
                        <span><strong>Read reviews</strong> from verified Deaf students and staff for real experiences</Text>
                      </li>
                      <li className="flex items-start gap-2">
                        <Text className="text-[#FF85A2] mt-1">•</Text>
                        <span><strong>Look for BSL Ready badges</strong> to find spaces with interpreter areas and caption displays</Text>
                      </li>
                      <li className="flex items-start gap-2">
                        <Text className="text-[#FF85A2] mt-1">•</Text>
                        <span><strong>Check Top Tips</strong> for expert advice on the best seats and what to avoid</Text>
                      </li>
                    </ul>
                  </View>

                  {/* General Help */}
                  <View className="space-y-2">
                    <View className="flex items-center gap-2">
                      <Info className="w-5 h-5 text-[#6B5CAC]" strokeWidth={2} />
                      <Text className="text-lg text-[#2A0098]" style={{ fontWeight: 600 }}>Need More Help?</Text>
                    </View>
                    <Text className="text-[#6B5CAC] leading-relaxed">
                      Use the <strong>Sort dropdown</strong> to filter by Top Rated rooms, BSL Ready spaces first, or most Recent reviews. Tap any room card to see full details, reviews, and use our Seat Finder quiz to get personalised seating recommendations.
                    </Text>
                    <View className="mt-3 p-4 bg-[#FF85A2]/10 rounded-2xl">
                      <Text className="text-[#2A0098] text-sm leading-relaxed">
                        <strong>💡 Quick Tip:</strong> Add your own reviews to help the community! Verified reviews from Deaf students are the most helpful.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </Animated.View>
          </>
        )}
      
    </View>
  );
}