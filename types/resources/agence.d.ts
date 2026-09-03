export class AgenceResource {
    constructor(client: any);
    client: any;
    /**
     * Récupère le solde de l'agence
     */
    getSolde(): Promise<any>;
    /**
     * Récupère les courses de l'agence
     */
    getCourses(params?: {}): Promise<any>;
    /**
     * Met à jour le statut d'une course
     */
    updateStatus(courseId: any, status: any, livreurId?: null): Promise<any>;
    /**
     * Récupère les livreurs de l'agence
     */
    getLivreurs(params?: {}): Promise<any>;
    /**
     * Ajoute un livreur
     */
    addLivreur(data: any): Promise<any>;
    /**
     * Supprime un livreur
     */
    removeLivreur(livreurId: any): Promise<any>;
    /**
     * Met à jour un livreur
     */
    updateLivreur(livreurId: any, data: any): Promise<any>;
    /**
     * Récupère les statistiques de l'agence
     */
    getStats(): Promise<any>;
    /**
     * Récupère les notifications de l'agence
     */
    getNotifications(params?: {}): Promise<any>;
    /**
     * Marque une notification comme lue
     */
    markNotificationAsRead(notificationId: any): Promise<any>;
}
//# sourceMappingURL=agence.d.ts.map