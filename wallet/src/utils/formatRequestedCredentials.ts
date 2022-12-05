import type {
  ProofPredicateInfo,
  ProofRecord,
  RequestedAttribute,
  RequestedCredentials,
  RequestedPredicate,
} from '@aries-framework/core'

type FormattedRequestedCredential = {
  name: string
  value: string
  isPredicate: boolean
}

export type FormattedRequestedCredentials = Array<FormattedRequestedCredential>

export const formatRequestedCredentials = (
  record: ProofRecord,
  credentials: RequestedCredentials
): FormattedRequestedCredentials => {
  const { requestedAttributes, requestedPredicates, selfAttestedAttributes } =
    credentials

  const proofRecordPredicates =
    record.requestMessage?.indyProofRequest.requestedPredicates

  const attributeNames = (
    Array.from(
      record.requestMessage?.indyProofRequest.requestedAttributes.values()
    ) as Array<{ names?: Array<string>; name?: string }>
  ).flatMap((nn) => (nn.name ? [nn.name] : nn.names))

  const predicateNames = (
    Array.from(
      record.requestMessage?.indyProofRequest.requestedPredicates.values()
    ) as Array<{ names?: Array<string>; name?: string }>
  ).flatMap((nn) => (nn.name ? [nn.name] : nn.names))

  return [
    ...formatAttributes(requestedAttributes, attributeNames),
    ...formatPredicates(
      requestedPredicates,
      proofRecordPredicates,
      predicateNames
    ),
    ...formatSelfAttested(selfAttestedAttributes),
  ]
}

const formatAttributes = (
  requestedAttributes: Record<string, RequestedAttribute>,
  names: Array<string>
): FormattedRequestedCredentials => {
  let allAttributes: Record<string, string> = {}
  Object.values(requestedAttributes).forEach((a) => {
    allAttributes = { ...allAttributes, ...a.credentialInfo.attributes }
  })

  return names.map((name) => {
    const attribute = allAttributes[name]
    if (!attribute) return
    return {
      name,
      value: attribute,
      isPredicate: false,
    } as FormattedRequestedCredential
  })
}

const formatPredicates = (
  requestedPredicates: Record<string, RequestedPredicate>,
  proofRecordPredicates: Map<string, ProofPredicateInfo>,
  names: Array<string>
): FormattedRequestedCredentials => {
  let allAttributes: Record<string, string> = {}
  Object.values(requestedPredicates).forEach((a) => {
    allAttributes = { ...allAttributes, ...a.credentialInfo.attributes }
  })

  return names.map((name) => {
    const attribute = allAttributes[name]
    if (!attribute) return
    const { predicateType, predicateValue } = proofRecordPredicates.get(name)
    return {
      name,
      value: `${predicateValue} ${predicateType} ${attribute}`,
      isPredicate: true,
    } as FormattedRequestedCredential
  })
}

const formatSelfAttested = (selfAttestedAttributes: Record<string, string>) =>
  Object.entries(selfAttestedAttributes).map(([key, value]) => ({
    name: key,
    value: value,
    isPredicate: false,
  }))
