export interface SpecificationGroup {
  name: string
  originalName: string
  specifications: Array<{
    name: string
    originalName: string
    values: string[]
  }>
}

/** Uma specification por nome, mantendo a primeira ocorrência. */
function dedupeByName(specifications: SpecificationGroup['specifications']) {
  const seen = new Set<string>()

  return specifications.filter((specification) => {
    if (seen.has(specification.name)) {
      return false
    }

    seen.add(specification.name)

    return true
  })
}

/**
 * Grupos de especificação que viram abas, um para um com o cadastro do
 * catálogo — nenhum nome é tratado de forma especial.
 *
 * A única exclusão é `allSpecifications`: não é um grupo real, é o agregado
 * sintético que a VTEX Search sempre injeta com a união de todos os outros, e
 * incluí-lo duplicaria cada atributo na tela. Grupos que não devem aparecer na
 * PDP são responsabilidade do cadastro da specification no admin da VTEX.
 */
export function tableSpecificationGroups(
  specificationGroups?: SpecificationGroup[] | null
) {
  return (specificationGroups ?? [])
    .filter((group) => group.name !== 'allSpecifications')
    .map((group) => ({
      ...group,
      specifications: dedupeByName(group.specifications),
    }))
    .filter((group) => group.specifications.length > 0)
}
