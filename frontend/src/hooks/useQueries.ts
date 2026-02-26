import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Asset } from '../backend';
import { DeleteResult } from '../backend';

export function useGetAllAssets() {
  const { actor, isFetching } = useActor();

  return useQuery<Asset[]>({
    queryKey: ['assets'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAssets();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useGetAssetsByLocation(locationId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Asset[]>({
    queryKey: ['assets', 'location', locationId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAssetsByLocation(locationId);
    },
    enabled: !!actor && !isFetching && !!locationId,
  });
}

export function useGetAssetCountsByCategory() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, bigint]>>({
    queryKey: ['assets', 'counts', 'category'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAssetCountsByCategory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetLocationCountsByCondition() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, Array<[string, bigint]>]>>({
    queryKey: ['assets', 'counts', 'location-condition'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLocationCountsByCondition();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useExportAssetVerifications() {
  const { actor } = useActor();

  return useQuery<Asset[]>({
    queryKey: ['assets', 'export'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.exportAssetVerifications();
    },
    enabled: false,
    staleTime: 0,
    gcTime: 0,
  });
}

export function useSubmitAssetCheck() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      assetId: string;
      name: string;
      category: string;
      locationId: string;
      condition: string;
      remarks: string;
      latitude: number;
      longitude: number;
      photos: string[];
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.submitAssetCheck(
        params.assetId,
        params.name,
        params.category,
        params.locationId,
        params.condition,
        params.remarks,
        params.latitude,
        params.longitude,
        params.photos
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
}

export function useUpdateAssetStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      assetId: string;
      condition: string;
      remarks: string;
      latitude: number;
      longitude: number;
      photos: string[];
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateAssetStatus(
        params.assetId,
        params.condition,
        params.remarks,
        params.latitude,
        params.longitude,
        params.photos
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
}

export function useDeleteAsset() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assetId: string) => {
      if (!actor) throw new Error('Actor not initialized');
      const result = await actor.deleteAsset(assetId);
      if (result === DeleteResult.assetNotFound) {
        throw new Error('Asset not found');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
}
