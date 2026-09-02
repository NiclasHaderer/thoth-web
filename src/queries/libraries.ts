import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Api, PartialUpdateLibrary, UUID, UpdateLibrary } from "@thoth/client"
import { invalidateMembership } from "./cache"
import { queries } from "./queries"

export const useLibraries = () => useQuery(queries.libraries)

export const useLibrary = (libraryId: UUID) => useLibraries().data?.find(library => library.id === libraryId)

export const useCreateLibrary = () => {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { action: "create the library" },
    mutationFn: (library: UpdateLibrary) => Api.createLibrary(library),
    onSuccess: () => invalidateMembership(queryClient),
  })
}

export const useUpdateLibrary = () => {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { action: "save the library" },
    mutationFn: ({ id, library }: { id: UUID; library: PartialUpdateLibrary }) =>
      Api.updateLibrary({ libraryId: id }, library),
    onSuccess: () => invalidateMembership(queryClient),
  })
}

export const useDeleteLibrary = () => {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { action: "delete the library" },
    mutationFn: (id: UUID) => Api.deleteLibrary({ libraryId: id }),
    onSuccess: async (_result, id) => {
      queryClient.removeQueries({ queryKey: queries.library(id) })
      await queryClient.invalidateQueries({ queryKey: queries.librarySearches })
      await invalidateMembership(queryClient)
    },
  })
}
