import { View } from 'react-native';
import { Skeleton } from "./ui/skeleton";

export function SkeletonCard() {
  return (
    <View className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-lg p-6 space-y-4">
      <View className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <View className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </View>
      </View>
      <Skeleton className="h-24 w-full rounded-xl" />
    </View>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <View className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}
