export function getPortalRoot() {
    const portalRoot = document.getElementById("portal-root")
    if (!portalRoot) {
        console.error("portalRoot not found")
        return null
    }
    return portalRoot
}
