import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Api, PartialUpdateLibrary, UUID, UpdateLibrary, unwrap } from "@thoth/client"
import { invalidateLibraryMembership } from "./invalidate"
import { queryKeys } from "./keys"

export const useLibraries = () =>
  useQuery({
    queryKey: queryKeys.libraries,
    queryFn: () => unwrap(Api.listLibraries()),
    staleTime: 5 * 60_000,
  })

export const useLibrary = (libraryId: UUID) => useLibraries().data?.find(library => library.id === libraryId)

export const useCreateLibrary = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (library: UpdateLibrary) => unwrap(Api.createLibrary(library)),
    onSuccess: () => invalidateLibraryMembership(queryClient),
  })
}

export const useUpdateLibrary = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, library }: { id: UUID; library: PartialUpdateLibrary }) =>
      unwrap(Api.updateLibrary({ libraryId: id }, library)),
    onSuccess: () => invalidateLibraryMembership(queryClient),
  })
}

export const useDeleteLibrary = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: UUID) => unwrap(Api.deleteLibrary({ libraryId: id })),
    onSuccess: async (_result, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.library(id) })
      await queryClient.invalidateQueries({ queryKey: queryKeys.librarySearches })
      await invalidateLibraryMembership(queryClient)
    },
  })
}
